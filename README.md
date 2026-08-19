# PaySpeak

全球收单风控英语听说实训平台 —— 专为支付行业风控合规人才打造的 AI 对话式英语学习工具。

## Features

- **5 Training Scenarios**: Card Network Compliance, Representment & Pre-Arbitration, RDR Pitch, Mastercard Collaboration, Friendly Fraud Investigation
- **Voice Input**: Web Speech API for real-time speech-to-text
- **Text Input**: Alternative keyboard input for environments without microphone access
- **AI Chat**: Simulated role-play with compliance officers, issuers, and merchants
- **Coach Panel**: Real-time feedback on terminology, grammar, and business logic
- **Scoring**: Fluency, accuracy, and terminology metrics
- **Responsive**: Works on desktop and mobile devices
- **Zero Backend**: Fully static — runs entirely in the browser

## Scenarios

| Scenario | Difficulty | Description |
|----------|-----------|-------------|
| 卡组织合规质询 | Expert | Simulate Visa VFMP/VDMP and Mastercard ECP compliance reviews |
| 拒付抗辩与预仲裁 | Advanced | Practice chargeback representment through VROL/Mastercom |
| 高级争议拦截系统推介 | Advanced | Pitch Visa RDR to merchant executives |
| Mastercard Collaboration 机制详解 | Intermediate | Explain early-warning dispute collaboration |
| 善意欺诈调查与应对 | Intermediate | Investigate friendly fraud patterns |

## Deployment

This project deploys automatically to GitHub Pages when pushing to `main`.

### Setup

```bash
# 1. Create a new GitHub repository
# 2. Push this project:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/risk-english-platform.git
git push -u origin main
```

### Enable GitHub Pages

1. Go to your repository **Settings → Pages**
2. Set **Source** to `GitHub Actions`
3. Your site will be live at `https://YOUR_USERNAME.github.io/risk-english-platform/`

## Local Development

```bash
npm install
npm run dev
```

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Voice**: Web Speech API (STT/TTS)
- **Architecture**: Pure static SPA — no backend required

## Future Enhancements

- WebGPU Whisper (Transformers.js) for local STT
- WebLLM for local LLM inference
- Cloudflare Workers proxy for cloud LLM fallback
- IndexedDB persistence for conversation history
