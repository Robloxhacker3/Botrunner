import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

export default async (req, res) => {
    if (req.method === 'POST') {
        const { code } = req.body;

        try {
            // Save bot code to a file
            const botFilePath = path.join('/tmp', 'bot.js');
            await fs.writeFile(botFilePath, code);

            // Handle package.json if provided
            const packageJsonFile = req.files?.packageJson;
            if (packageJsonFile) {
                const packageJsonPath = path.join('/tmp', 'package.json');
                await fs.writeFile(packageJsonPath, packageJsonFile.data);

                // Install dependencies
                await new Promise((resolve, reject) => {
                    exec('npm install', { cwd: '/tmp' }, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            }

            // Start the bot
            exec(`node ${botFilePath}`, { cwd: '/tmp' }, (err, stdout, stderr) => {
                if (err) {
                    console.error(stderr);
                } else {
                    console.log(stdout);
                }
            });

            res.status(200).json({ message: "Bot started successfully!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to start the bot." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
