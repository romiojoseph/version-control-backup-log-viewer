let jsonData = null;
let sortAscending = true;

document.addEventListener('DOMContentLoaded', () => {
    // First try to load the default JSON
    fetch('assets/bluesky-feeds_log.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            loadData();
        })
        .catch(error => {
            console.error('Error loading default JSON:', error);
            // Silently fail instead of showing error
        });
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                jsonData = JSON.parse(e.target.result);
                loadData();
            } catch (error) {
                alert("Failed to parse JSON file.");
            }
        };
        reader.readAsText(file);
    }
});

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        alert('Path copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text:', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

function loadData() {
    if (!jsonData) return;

    // Get all backup entries and sort them to find the latest version
    const backupEntries = Object.entries(jsonData)
        .filter(([key]) => key.startsWith('backup_'))
        .sort((a, b) => {
            const versionA = a[1].version.substring(1); // Remove 'v' prefix
            const versionB = b[1].version.substring(1);
            return compareVersions(versionB, versionA); // Sort in descending order
        });

    if (backupEntries.length === 0) return;

    // Get the latest version's data
    const [latestKey, latestBackup] = backupEntries[0];
    const latestProjectInfo = jsonData[`project_info_${latestBackup.version}`];

    // Update project name
    const projectName = latestProjectInfo.project_folder.split('\\').pop();
    document.getElementById('projectName').textContent = `${projectName}`;

    // Update latest info display using the latest project_info
    document.getElementById('latestTimestamp').textContent = `Last backup at ${latestBackup.date}`;
    document.getElementById('latestVersion').textContent = ` | ${latestBackup.version}`;
    document.getElementById('latestFileSize').textContent = `${formatSize(latestProjectInfo.backup_file_size)}`;
    document.getElementById('latestFolderCount').textContent = `${latestProjectInfo.num_folders} folders | `;
    document.getElementById('latestFileCount').textContent = `${latestProjectInfo.num_files} files`;

    // Populate table
    const tableBody = document.querySelector("#backupTable tbody");
    tableBody.innerHTML = '';

    // Sort entries based on current sort direction
    const sortedEntries = backupEntries.sort((a, b) => {
        const versionA = a[1].version.substring(1);
        const versionB = b[1].version.substring(1);
        return sortAscending
            ? compareVersions(versionA, versionB)
            : compareVersions(versionB, versionA);
    });

    // Rest of the table population code remains the same
    sortedEntries.forEach(([key, data]) => {
        const projectInfo = jsonData[`project_info_${data.version}`];
        const row = document.createElement('tr');

        // Create the changes tooltip content if changes exist
        let changesHtml = '';
        if (data.changes) {
            const hasAnyChanges =
                (data.changes.added_files && data.changes.added_files.length > 0) ||
                (data.changes.modified_files && data.changes.modified_files.length > 0) ||
                (data.changes.deleted_files && data.changes.deleted_files.length > 0) ||
                data.changes.structure_changed;

            if (!hasAnyChanges) {
                changesHtml = `<h6>No changes in this backup</h6>`;
            } else {
                changesHtml = `
                    <div class="changes-sections">
                        ${data.changes.structure_changed ? `
                            <div>
                                <h6 class="structure">Project Structure:</h6>
                                <ul>
                                    <li>Directory structure was modified</li>
                                </ul>
                            </div>
                        ` : ''}
                        ${data.changes.added_files && data.changes.added_files.length > 0 ? `
                            <div>
                                <h6 class="added">Added Files:</h6>
                                <ul>
                                    ${data.changes.added_files.map(file => `<li>${file}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${data.changes.modified_files && data.changes.modified_files.length > 0 ? `
                            <div>
                                <h6 class="modified">Modified Files:</h6>
                                <ul>
                                    ${data.changes.modified_files.map(file => `<li>${file}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                        ${data.changes.deleted_files && data.changes.deleted_files.length > 0 ? `
                            <div>
                                <h6 class="deleted">Deleted Files:</h6>
                                <ul>
                                    ${data.changes.deleted_files.map(file => `<li>${file}</li>`).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `;
            }
        }

        row.innerHTML = `
            <td>${data.version}</td>
            <td>${data.date}</td>
            <td class="copyable-cell" onclick="copyToClipboard('${data.project_folder.replace(/\\/g, '\\\\')}')">${data.project_folder}</td>
            <td>${projectInfo.num_folders}</td>
            <td>${projectInfo.num_files}</td>
            <td>${formatSize(projectInfo.total_size)}</td>
            <td>${data.project_hash}</td>
            <td class="changes-cell">
                ${data.message}
                ${changesHtml ? `<div class="tooltip">${changesHtml}</div>` : ''}
            </td>
            <td class="copyable-cell" onclick="copyToClipboard('${data.backup_folder.replace(/\\/g, '\\\\')}')">${data.backup_folder}</td>
            <td>${data.backup_file}</td>
            <td>${formatSize(projectInfo.backup_file_size)}</td>
        `;

        // Add event listeners for tooltip
        if (changesHtml) {
            const changesCell = row.querySelector('.changes-cell');
            const tooltip = changesCell.querySelector('.tooltip');

            changesCell.addEventListener('mouseenter', (e) => {
                tooltip.style.display = 'block';

                // Position the tooltip
                const rect = changesCell.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                // Calculate position to keep tooltip within viewport
                let left = e.clientX;
                let top = rect.bottom + window.scrollY;

                // Adjust if tooltip would go off-screen
                if (left + tooltipRect.width > window.innerWidth) {
                    left = window.innerWidth - tooltipRect.width - 20;
                }

                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
            });

            changesCell.addEventListener('mouseleave', () => {
                tooltip.style.display = 'none';
            });
        }

        tableBody.appendChild(row);
    });
}

function getLatestVersionKey(data) {
    let latestVersionKey = null;
    let latestVersion = null;

    Object.keys(data).forEach(key => {
        const version = key.split('_').pop().substring(1); // Remove 'v' prefix from 'v1.0'
        if (!latestVersion || compareVersions(version, latestVersion) > 0) {
            latestVersion = version;
            latestVersionKey = key;
        }
    });

    return latestVersionKey;
}

function compareVersions(v1, v2) {
    // Convert version strings to numbers for proper comparison
    const normalize = (v) => {
        const parts = v.toString().split('.');
        // Pad with zeros to ensure equal length
        while (parts.length < 3) parts.push('0');
        // Convert to numbers and pad each part to 3 digits
        return parts.map(p => p.padStart(3, '0')).join('');
    };

    return normalize(v1).localeCompare(normalize(v2));
}

function formatSize(bytes) {
    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;

    if (bytes >= GB) return `${(bytes / GB).toFixed(2)} GB`;
    if (bytes >= MB) return `${(bytes / MB).toFixed(2)} MB`;
    if (bytes >= KB) return `${(bytes / KB).toFixed(2)} KB`;
    return `${bytes} Bytes`;
}

function reloadData() {
    const fileInput = document.getElementById('fileInput');
    fileInput.value = '';
    fileInput.click();
}

function searchTable() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toLowerCase();
    const table = document.getElementById('backupTable');
    const rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        let cells = row.getElementsByTagName('td');
        let match = false;

        for (let j = 0; j < cells.length; j++) {
            if (cells[j].textContent.toLowerCase().indexOf(filter) > -1) {
                match = true;
                break;
            }
        }

        row.style.display = match ? '' : 'none';
    }
}

function toggleSort() {
    sortAscending = !sortAscending;
    const sortIcon = document.getElementById('sortIcon');
    sortIcon.className = sortAscending ? 'ph-duotone ph-sort-ascending' : 'ph-duotone ph-sort-descending';
    loadData(); // Reload the table with new sorting
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}
