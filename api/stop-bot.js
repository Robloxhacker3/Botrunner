let botProcess;

export default async (req, res) => {
    if (req.method === 'POST') {
        if (botProcess) {
            botProcess.kill();
            botProcess = null;
            res.status(200).json({ message: "Bot stopped successfully!" });
        } else {
            res.status(400).json({ message: "No bot is currently running." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};
