# Task Manager App

A beautiful and intuitive Task Manager app built with React Native and Expo. This app allows users to create, manage, and track their daily tasks with a clean, modern interface.

![Task Manager App](https://img.shields.io/badge/React%20Native-0.79.5-blue) ![Expo](https://img.shields.io/badge/Expo-~53.0.20-black) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## 🚀 Features

### Core Functionality
- ✅ **Add Tasks**: Create new tasks with descriptive text
- ✅ **Mark as Complete**: Toggle tasks between completed and incomplete states
- 🗑️ **Delete Tasks**: Remove tasks with confirmation dialog
- 📋 **Task List**: View all tasks in an organized, scrollable list
- 📅 **Due Dates**: Set optional due dates for tasks with date/time picker
- 📝 **Task History**: Track all task actions (completed, undone, deleted)

### User Interface
- 🎨 **Modern Design**: Clean, intuitive interface with visual feedback
- 🌟 **Visual Indicators**: 
  - Color-coded task status (completed, overdue, due soon)
  - Progress counter showing completed vs total tasks
  - Visual badges and icons for different actions
- 📱 **Responsive Layout**: Optimized for mobile devices
- 🔔 **Smart Notifications**: Visual alerts for overdue and upcoming tasks
- 🎯 **Empty States**: Helpful messages when no tasks or history exist

### Enhanced User Experience
- ⚡ **Real-time Updates**: Instant visual feedback for all interactions
- 🔒 **Confirmation Dialogs**: Prevent accidental task deletion
- 📊 **Task Statistics**: Track completion progress
- 🎨 **Visual Hierarchy**: Clear distinction between different UI elements
- 🚀 **Smooth Navigation**: Seamless transitions between screens

## 📱 Screenshots

The app features two main screens:

1. **Home Screen**: Main task management interface
   - Add new tasks with optional due dates
   - View all tasks with completion status
   - Quick actions for completing/undoing and deleting tasks
   - Progress tracking and navigation to history

2. **History Screen**: Complete audit trail
   - Chronological list of all task actions
   - Color-coded action indicators
   - Detailed timestamps and task information

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Expo CLI (optional but recommended)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)
- Physical device with Expo Go app (alternative to simulators)

### Step-by-Step Installation

1. **Clone or download the project**
   ```bash
   # If you have the project as a zip file, extract it
   # Or clone from repository if available
   cd taskmanagerapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   # or
   expo start
   ```

4. **Run on your preferred platform**
   
   **Option A: Physical Device**
   - Install the Expo Go app from App Store (iOS) or Google Play (Android)
   - Scan the QR code displayed in your terminal or browser
   
   **Option B: iOS Simulator** (macOS only)
   ```bash
   npm run ios
   # or
   expo start --ios
   ```
   
   **Option C: Android Emulator**
   ```bash
   npm run android
   # or
   expo start --android
   ```
   
   **Option D: Web Browser**
   ```bash
   npm run web
   # or
   expo start --web
   ```

## 📖 How to Use

### Adding Tasks
1. Tap the text input field at the top of the home screen
2. Type your task description
3. (Optional) Tap "📅 Set Due Date" to add a deadline
4. Tap "Add Task" or press Enter to create the task

### Managing Tasks
- **Complete a task**: Tap the "✓ Done" button on any task
- **Undo completion**: Tap "↶ Undo" on completed tasks
- **Delete a task**: Tap "🗑️ Delete" and confirm in the dialog
- **View details**: Each task shows creation time and due date (if set)

### Task Status Indicators
- **Green border**: Normal active tasks
- **Yellow border**: Tasks due within 24 hours
- **Red border**: Overdue tasks
- **Grayed out**: Completed tasks

### Viewing History
1. Tap "📋 View Task History" on the home screen
2. Browse chronological list of all task actions
3. Each entry shows the original task, action taken, and timestamp

## 🏗️ Project Structure

```
taskmanagerapp/
├── App.js                 # Main app component with navigation
├── package.json          # Project dependencies and scripts
├── app.json             # Expo configuration
├── components/
│   └── TaskItem.js      # Individual task component
├── screens/
│   ├── HomeScreen.js    # Main task management screen
│   └── HistoryScreen.js # Task history screen
└── assets/              # App icons and splash screens
```

## 🔧 Technical Details

### Dependencies
- **React Native**: 0.79.5 - Core framework
- **Expo**: ~53.0.20 - Development platform and tools
- **React Navigation**: Navigation between screens
- **React Native DateTimePicker**: Date and time selection
- **React Native Safe Area Context**: Handle device safe areas
- **React Native Screens**: Optimize navigation performance

### State Management
- Uses React's built-in `useState` hooks for local component state
- No external state management library required
- State includes:
  - Current tasks array
  - Task history array
  - Form input values
  - UI state (date picker visibility, etc.)

### Data Structure
Each task object contains:
```javascript
{
  id: "unique_timestamp_string",
  text: "Task description",
  completed: boolean,
  createdAt: "formatted_date_string",
  dueDate: "formatted_date_string" | null
}
```

History entries include additional fields:
```javascript
{
  ...taskObject,
  action: "completed" | "undone" | "deleted",
  actionAt: "formatted_date_string"
}
```

## 🎨 Design System

### Colors
- Primary: `#4CAF50` (Green)
- Secondary: `#2c3e50` (Dark Blue)
- Warning: `#ffc107` (Amber)
- Danger: `#dc3545` (Red)
- Background: `#f8f9fa` (Light Gray)
- Surface: `#ffffff` (White)

### Typography
- Title: 28px, Bold
- Subtitle: 16px, Regular
- Body: 16px, Medium
- Caption: 12px, Regular

### Spacing
- Container padding: 15-20px
- Component margins: 10-15px
- Button padding: 10-15px
- Border radius: 8-15px

## 🚀 Future Enhancements

Potential features for future versions:
- 📂 **Categories/Tags**: Organize tasks by category
- 🔍 **Search & Filter**: Find specific tasks quickly
- 📊 **Analytics**: Task completion statistics and insights
- 🔔 **Push Notifications**: Reminders for due tasks
- 💾 **Data Persistence**: Save tasks locally or to cloud
- 🌙 **Dark Mode**: Alternative color scheme
- 📤 **Export/Import**: Share task lists
- 👥 **Collaboration**: Share tasks with others

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
# Clear Metro cache
npx expo start --clear
# or
npm start -- --reset-cache
```

**iOS Simulator not opening:**
- Ensure Xcode is installed and iOS Simulator is available
- Try `expo start --ios` instead of `npm run ios`

**Android Emulator issues:**
- Ensure Android Studio is installed with an AVD created
- Check that the emulator is running before starting the app

**Dependencies not installing:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
# or
yarn install
```

### Performance Tips
- Close unused apps on your device for better performance
- Use a physical device for the best experience
- Restart the Metro bundler if the app becomes unresponsive

## 📄 License

This project is created as a technical demonstration and is available for educational purposes.

## 🤝 Contributing

This is a technical screen project, but feedback and suggestions are welcome!

---

**Built with ❤️ using React Native and Expo**