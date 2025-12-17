# sripto
AI-powered tool to generate consistent high-resolution 4K cinematic realistic action movie images. Upload character references, batch prompts, organize generated images with auto-naming and export.

## Professional Storyboard & Screenplay Tool

Sripto is designed for screenwriters, directors, and content creators who need to maintain visual consistency across action sequences and storyboards.

## Core Features

### 📸 Character & Scene Management
- **4 Reference Upload Slots**: Character, Scene, Style, Custom
- Editable character names and toggles
- Image upscaling and enhancement built-in
- Best quality 4K resolution output

### 🎬 Batch Prompt Generation
- Input up to 10+ cinematic prompts at once
- Each prompt generates one consistent 4K frame
- Aspect ratio control: 16:9, 9:16, 1:1, 4:3, Custom
- Example prompt format:
```
Frame 1: 4K photoreal cinematic frame — limousine trunk interior, claustrophobic low light, contrasted with golden horizon outside. Humanoid animals in Kingsman suits.
```

### 📝 Advanced Script Export with Audio Cues
Each frame exports with:
- **Visual Description**: Full prompt text
- **Camera Details**: Angles, lens specs (e.g., "200mm long lens")
- **Lighting Notes**: Interior/exterior, color temperature
- **Audio Cues**: Sound effects (trunk latch thud, muffled breath, distant horn)
- **Dialogue Lines**: Voice-over and character speech
- **Continuity Log**: Track props, costumes, positions between frames

### 🎯 Continuity Tracking
- Log critical details: costume creases, prop states, lighting setup
- Ensure consistency across all generated frames
- Essential for action sequences and multi-shot scenes

### 💾 Export & Organization
- **Auto-Naming**: 001_17Dec2025.png, 002_17Dec2025.png, etc.
- **Batch Download**: One-click ZIP of all frames
- **Script Export**: Copy-paste ready text with all metadata
- Individual frame download available

## How It Works (No API Key Required)

1. **Upload References**: Add character and scene reference images
2. **Write Prompts**: Enter detailed cinematic prompts with camera, lighting, and audio notes
3. **Generate Externally**: Copy prompts → paste into Google AI Studio or similar → generate images
4. **Upload Results**: Drop generated images back into Sripto for organization
5. **Export Package**: Download all frames + complete script with audio/continuity notes

## Professional Use Cases

✅ **Action Sequence Storyboarding**: Maintain character/costume consistency across 20+ frames  
✅ **Shot List Planning**: Organize camera angles, lighting, and audio for each scene  
✅ **Dialogue & Audio Design**: Track voice-over, SFX, and music cues per frame  
✅ **Continuity Management**: Log costume details, prop positions, lighting states  
✅ **Client Presentations**: Export professional storyboard packages with full technical details

## Design

- Modern black background with Jamaican (green/gold/red) and pan-African color accents
- Two-column layout: Controls (left) | Results Grid (right)
- Professional, organized interface for production workflows

## Technical Stack

- Frontend-only React app (no backend required)
- Client-side image handling and ZIP generation
- LocalStorage for session persistence
- Works with any external AI image generator (Gemini, Midjourney, Stable Diffusion, etc.)

## Example Script Export Format

```
FRAME 001 — LIMOUSINE TRUNK INTERIOR
Visual: 4K photoreal cinematic frame, claustrophobic low light trunk interior contrasted with golden horizon outside. Gorilla in tactical hybrid jacket, heavy boots, dreadlocks tucked, rifle across knees.
Camera: Interior macro on gorilla's eyes and rifle scope
Lighting: Cool interior, warm exterior horizon
Audio: Trunk latch thud, muffed breath
Continuity: Trunk latch CLOSED, jacket zipper at 3/4, rifle positioned diagonal

FRAME 002 — YACHT LEAVING HARBOR
Visual: 200mm long lens of yacht receding, Kingsman security detail silhouettes on deck, slim black suits.
Camera: 200mm telephoto, compressed perspective
Lighting: Golden hour, backlit silhouettes
Audio: Distant yacht horn, deep drum rolls
Continuity: Same suits from trunk scene, earpieces visible
```

---

**Built for creators who demand visual consistency and professional workflow management.**
