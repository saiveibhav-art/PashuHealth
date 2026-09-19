# 🐄 PashuHealth

**PashuHealth** is a practical, technology-enabled disease surveillance concept designed to empower rural Indian dairy farmers. It operates as a zero-hardware, offline-first mobile application that utilizes computer vision to detect early signs of **Mastitis** and **Theileriosis**.

---

## 🚨 The Problem

Livestock disease management in India suffers from a massive diagnostic gap. Smallholder farmers lack rapid access to veterinary testing, leading to severe economic and welfare consequences:

* **Massive Economic Drain:** According to the NDRI, farmers in India lose more than ₹21,000 crore annually due to Mastitis and Theileriosis[cite: 1].
* **Production Loss:** A Mastitis infection can reduce milk yield by 25% while simultaneously degrading milk quality[cite: 1].
* **Mortality Risk:** Theileriosis (a tick-borne disease) causes severe fever and anaemia, increasing the mortality risk by 22% in susceptible cattle[cite: 1].

## 💡 Our Solution: The Smartphone as an Edge-Sensor

PashuHealth eliminates the need for expensive IoT collars or inline sensors. We turn the farmer's existing Android device into an AI-powered diagnostic tool that works entirely **without an internet connection**.

### ✨ Core Features

1. **Mastitis Detection (Clinical & Subclinical):**
* **Udder Scan:** YOLOv8 object detection analyzes standard smartphone photos for udder asymmetry, redness, and lesions.
* **CMT Reader:** AI analyzes photos of the California Mastitis Test (CMT) paddle to instantly grade milk clotting and gel viscosity, removing human subjectivity.


2. **Theileriosis Screening:**
* **Farmer Early-Warning:** Image classification of the cow's mucous membrane (eye) to detect severe anemia and jaundice, coupled with tick-infestation detection.
* **Veterinary Module:** ResNet50 deep learning model analyzes microscopic blood smears (taken via a smartphone microscope mount) to confirm *Theileria* parasites.


3. **Multilingual Voice Accessibility:**
* Integrated with the **Bhashini API (Gov of India)** to instantly convert text-based risk alerts into local language voice prompts (Hindi, Marathi, Tamil) for farmers with low literacy.


4. **Offline-First Architecture:**
* All AI inference runs locally via `.tflite` models. Records are stored in a local SQLite database and asynchronously synced to the cloud whenever a network connection is restored.



---

## 🛠️ Technology Stack

| Layer | Technology Used | Purpose |
| --- | --- | --- |
| **Frontend Mobile App** | Flutter / Dart | Cross-platform, accessible, and resource-efficient UI. |
| **Edge AI Models** | TensorFlow Lite (TFLite) | Runs quantized YOLOv8 and ResNet50 models offline on mobile CPU. |
| **Local Database** | SQLite | Caches farmer inputs and AI predictions during network outages. |
| **Backend API** | FastAPI (Python) | Lightweight data validation and cloud synchronization bridge. |
| **Cloud Database** | Firebase / PostgreSQL | Centralized veterinary dashboard and health record storage. |
| **Localization** | Bhashini API | Real-time Neural Machine Translation and Text-to-Speech (TTS). |

---

## 🏗️ System Architecture

1. **Capture:** The farmer takes a photo using the PashuHealth camera interface.
2. **Local Inference:** The image is fed into the embedded TensorFlow Lite models.
3. **Result Generation:** The app generates a color-coded risk score (Red/Yellow/Green) and saves it to the local SQLite database.
4. **Voice Alert:** If online, the result is sent to Bhashini API for localized audio playback.
5. **Cloud Sync:** When internet is available, pending local records are pushed via FastAPI to the central database for veterinary review.

---

## 🚀 Installation & Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/PashuHealth.git
cd PashuHealth

```

### 2. Set Up the Flutter App

```bash
cd frontend
flutter pub get
flutter run

```

*(Ensure you have an Android emulator running or a physical device connected with USB debugging enabled).*

### 3. Set Up the FastAPI Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
uvicorn main:app --reload

```
