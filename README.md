## Why I created this script?

### • Disclaimer
This script may not work for everyone. It's designed to work with a common style. Also, no data is sent anywhere—everything runs in your browser. Heads up; you need to load the individual project JSON files, not the backup_config.json file. You can check out the project on [GitHub](https://github.com/romiojoseph/version-control-backup-log-viewer). I developed the entire JavaScript using LLMs (Mistal AI and Claude). Also, hey, it's a PWA! So just install and pin it if you use the backup script more often.

### • Backstory
I got into coding [recently](https://romio.substack.com/p/ai-assisted-learning-journey-10000-hours-snowball-effect), mostly because LLMs started giving more accurate results. I began with small scripts, and since then, I've created many things. With every new project, I'm testing my own limits. That's one of the main reasons I don't use trackers or analytics. I want people to browse these projects knowing their sessions are not tracked or measured. But since I deploy everything on GitHub Pages, their trackers might exist, I'm not sure about that.

### • Why
These days, it's easy to build small-scale projects with LLMs, and the gaps are closing fast. I admit I don't fully understand how JavaScript or Python works. But when I explain what I need and test things, I know what to expect and how to guide the LLM to get the results I want.

I'm not sure if I'm getting better at coding, but I'm getting better at explaining my requirements. What we need is patience because this isn't a one-way route or a straightforward process. We need to go back and forth many times, and sometimes we may hit a wall and question our own abilities.

But when we finally get results, it's a moment of pure joy and satisfaction. That's what keeps me going. In this journey, LLMs hallucinate, because whatever their context length is, they just remove features and functionalities and our code might break. And that will drive our entire day or sometimes days. Some bugs won't even let us sleep. Because we know, our project works, but some error keeps repeating. That happened to me many times in the beginning. Eventually, I started taking zips of the project folder whenever I copy-pasted new changes, just to create a safe restore point. So that I can start again from a position I'm comfortable with.

I tried Git, but it felt too complicated, and since I was just starting, I avoided overwhelming experiences. I didn't mind creating zips manually. However, one day I started to dislike this process. It felt like a lot. I knew a script could simplify it, but I never made it a priority. At some point, I hit my limit and created [the first version of this script](https://github.com/romiojoseph/open-source/tree/main/utility-scripts/version-control-backup-python-script). It was very handy, until it wasn't.

### • Optimize
To optimize anything, we have to use it daily. Only then we can spot potential issues. My script's first version was straightforward, but I felt something was missing and started thinking it wasn't quite there yet. While building the [Lichess PGN Analyzer](https://github.com/romiojoseph/lichess-pgn-analyzer) project, I started considering a lightweight Electron app.

But when I tried one, I felt it was too much and defeated the purpose. So, I thought of other ways to make the process simpler. I wanted fewer clicks and real-time updates, but some browser limitations prevent files from auto-reloading. I had to manually initiate that process, but it was a step I was willing to take. After exploring possibilities, I concluded that a PWA is the best option for now.

Maybe there are already solutions for this pain point I'm trying to solve, but I like creating a workflow that works for me. Not everything can be customized to meet unique needs. That's why I share all my projects on GitHub. So people exploring solutions for their needs can clone the project and tweak it as they like. (Please note that the default content in the table is just a placeholder.)

It’s a good practice to write clear and meaningful backup messages to help you easily understand the context of each version. The `logs` folder will be created in the same directory as the Batch and Python scripts. Deleted logs are retained for safety and clarity. Ensure the script path stays synchronized with a secure cloud storage service using [Syncthing](https://syncthing.net) or any alternative of your choice.

While the script includes safeguards to prevent data loss, it is always a good practice to manually verify backups every now and then and ensure that important data is not accidentally deleted or overwritten. If you have any concerns, review the code using any LLMs thoroughly to understand what it does. Ensure that it aligns with your expectations and does not perform any unwanted actions. Before running the script on critical data, test it in a safe environment with non-essential data to ensure it behaves as expected.

Because this script was created with the help of LLMs, I used another LLM to review its safety. The following was its conclusion:

> "The script appears to be designed with safety in mind, but it is always important to review and test any script before running it on critical data. Ensure you understand what the script does and trust the source of the code."

Created by [Romio](https://romio.framer.website). View more open-source projects on [GitHub](https://romiojoseph.github.io/open-source/).
