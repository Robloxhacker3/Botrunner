import { exec } from 'child_process';
import path from 'path';

export default async (req, res) => {
    if (req.method === 'POST') {
        try {
            const botFilePath = path.join('/tmp', 'bot.js');

            // Run the bot
            exec(`node ${botFilePath}`, { cwd: '/tmp' }, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                    res.status(500).json({ message: "Failed to run the bot." });
                } else {
                    console.log(stdout);
                    res.status(200).json({ message: "Bot is running!" });
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to run the bot." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
