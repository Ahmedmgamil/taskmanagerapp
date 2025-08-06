# Task Manager - React Native App

A comprehensive Task Manager application built with React Native and Expo, featuring advanced task management capabilities, notifications, calendar integration, and a beautiful user interface.

## 🚀 Features

### Core Task Management (CRUD)
- ✅ **Create Tasks** - Add new tasks with detailed information
- ✅ **Read Tasks** - View all tasks in list or calendar format
- ✅ **Update Tasks** - Edit existing tasks with full form support
- ✅ **Delete Tasks** - Remove tasks with confirmation dialogs

### Task Status Tracking
- 📝 **To Do** - Tasks that haven't been started
- ⏳ **In Progress** - Tasks currently being worked on
- ✅ **Done** - Completed tasks
- 🔄 **Status Cycling** - Tap tasks to cycle through statuses

### Due Dates & Scheduling
- 📅 **Set Due Dates** - Assign deadlines to tasks
- 🔴 **Overdue Highlighting** - Visual indicators for overdue tasks
- 📊 **Calendar View** - See tasks organized by date
- 🎯 **Date-based Sorting** - Sort tasks by due date

### Task Organization
- 🏷️ **Categories/Projects** - Organize tasks by:
  - Work (Blue)
  - Personal (Purple)
  - Health (Green)
  - Finance (Red)
  - Education (Orange)
- 🎨 **Color-coded Labels** - Visual organization with colored badges
- 🔍 **Category Filtering** - Filter tasks by category

### Task Prioritization
- 🔥 **High Priority** (Red) - Urgent tasks
- ⚡ **Medium Priority** (Orange) - Important tasks  
- 🌱 **Low Priority** (Green) - Less urgent tasks
- 📈 **Priority Sorting** - Sort tasks by priority level

### Search & Filtering
- 🔍 **Text Search** - Search by task title or description
- 🎯 **Multi-filter Support** - Filter by:
  - Status (To Do, In Progress, Done)
  - Category (Work, Personal, Health, etc.)
  - Priority (High, Medium, Low)
- 📊 **Multiple Sorting Options** - Sort by:
  - Creation date
  - Priority level
  - Due date

### Advanced Productivity Features
- 🔄 **Recurring Tasks** - Set tasks to repeat:
  - Daily
  - Weekly
  - Monthly
- ⏰ **Time Estimates** - Track estimated completion time
- 🔔 **Push Notifications** - Reminder notifications 1 hour before due time
- 💾 **Persistent Storage** - Tasks saved locally with AsyncStorage

### User Interface
- 🎨 **Modern Design** - Clean, intuitive Material Design-inspired UI
- 📱 **Responsive Layout** - Works on various screen sizes
- 🌈 **Visual Feedback** - Smooth animations and state changes
- 📋 **List View** - Traditional task list with rich information
- 📅 **Calendar View** - Visual calendar with task markers
- ➕ **Floating Action Button** - Quick task creation
- 🎛️ **Modal Forms** - Full-featured task editing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (install globally: `npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Quick Start

1. **Clone/Download the project**
   ```bash
   # If you have the project files
   cd TaskManager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on your device/simulator**
   - For iOS: `npm run ios` or scan QR code with iOS Camera
   - For Android: `npm run android` or scan QR code with Expo Go app
   - For Web: `npm run web`

### Alternative Setup (Create from scratch)

If you want to create this project from scratch:

```bash
# Create new Expo project
npx create-expo-app@latest TaskManager --template blank

# Navigate to project
cd TaskManager

# Install additional dependencies
npm install @expo/vector-icons react-native-calendars expo-notifications @react-native-async-storage/async-storage react-native-uuid date-fns

# Replace App.js with the provided code
# Start development server
npm start
```

## 🛠️ Dependencies

### Core Dependencies
- **expo** (~53.0.20) - Expo framework
- **react** (19.0.0) - React library
- **react-native** (0.79.5) - React Native framework

### UI & Icons
- **@expo/vector-icons** (^14.1.0) - Icon library with Ionicons
- **react-native-calendars** (^1.1313.0) - Calendar component

### Storage & Notifications
- **@react-native-async-storage/async-storage** (^2.2.0) - Local storage
- **expo-notifications** (^0.31.4) - Push notifications
- **expo-status-bar** (~2.2.3) - Status bar configuration

### Utilities
- **react-native-uuid** (^2.0.3) - UUID generation for unique task IDs
- **date-fns** (^4.1.0) - Date manipulation and formatting

## 📱 How to Use

### Creating Tasks
1. Tap the **+** (plus) button in the bottom right corner
2. Fill in the task details:
   - **Title** (required) - Name of your task
   - **Description** (optional) - Additional details
   - **Priority** - Choose Low, Medium, or High
   - **Category** - Select from Work, Personal, Health, Finance, or Education
   - **Status** - Set initial status (To Do, In Progress, Done)
   - **Due Date** - Tap "Set Due Date" to assign a deadline
   - **Recurring** - Set if task should repeat (Daily, Weekly, Monthly)
   - **Estimated Time** - How long you think the task will take
   - **Reminders** - Toggle to enable/disable notifications
3. Tap **Create** to save the task

### Managing Tasks
- **Change Status**: Tap on a task to cycle through statuses (To Do → In Progress → Done → To Do)
- **Edit Task**: Long press on a task to open the edit modal
- **Delete Task**: Tap the trash icon on the right side of any task
- **View Details**: All task information is displayed in the list view

### Search & Filter
1. **Search**: Type in the search bar to find tasks by title or description
2. **Filters**: Tap the filter icon in the header to show/hide filter options
   - **Status Filter**: Filter by task status
   - **Category Filter**: Filter by task category
   - **Priority Filter**: Filter by task priority
   - **Sort Options**: Change sorting between creation date, priority, or due date

### Calendar View
1. Tap the calendar icon in the header to switch to calendar view
2. Tasks with due dates appear as colored dots on their respective dates
3. Tap on a date to see all tasks due that day
4. Overdue tasks appear with red indicators

### Notifications
- The app will request notification permissions on first launch
- Notifications are sent 1 hour before a task's due date
- Only tasks with reminders enabled and that aren't completed will send notifications

## 🏗️ Project Structure

```
TaskManager/
├── App.js                 # Main application component
├── package.json          # Dependencies and scripts
├── app.json             # Expo configuration
├── README.md            # This file
└── assets/              # Images and icons
    ├── icon.png
    └── splash.png
```

## 🎨 Design Features

### Visual Feedback
- **Status Icons**: Different icons for To Do (○), In Progress (⏰), and Done (✅)
- **Priority Colors**: High (Red), Medium (Orange), Low (Green)
- **Category Colors**: Each category has its own color theme
- **Overdue Highlighting**: Red border and text for overdue tasks
- **Completed Tasks**: Strikethrough text for finished tasks

### User Experience
- **Haptic Feedback**: Smooth interactions with visual state changes
- **Loading States**: Proper loading and empty states
- **Error Handling**: User-friendly error messages and confirmations
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper contrast ratios and touch targets

## 🔧 Customization

### Adding New Categories
Edit the `CATEGORIES` array in App.js:
```javascript
const CATEGORIES = [
  { id: 'custom', name: 'Custom Category', color: '#YOUR_COLOR' },
  // ... existing categories
];
```

### Modifying Priority Levels
Update the `PRIORITIES` object in App.js:
```javascript
const PRIORITIES = {
  CUSTOM: { label: 'Custom', color: '#YOUR_COLOR', value: 4 },
  // ... existing priorities
};
```

### Changing Notification Timing
Modify the notification schedule in the `scheduleNotificationsForTasks` function:
```javascript
trigger: { date: new Date(dueDate.getTime() - 2 * 60 * 60 * 1000) }, // 2 hours before
```

## 🚀 Deployment

### Building for Production

**iOS:**
```bash
expo build:ios
```

**Android:**
```bash
expo build:android
```

### Publishing to Expo
```bash
expo publish
```

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npx expo start --clear
   ```

2. **Dependency conflicts**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **iOS Simulator not opening**
   - Ensure Xcode is installed and iOS Simulator is available
   - Try `expo run:ios`

4. **Android Emulator issues**
   - Ensure Android Studio is installed with an AVD
   - Try `expo run:android`

5. **Notification permissions not working**
   - Check device settings for the Expo Go app
   - Restart the app after granting permissions

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📞 Support

If you have any questions or need help with setup, please create an issue in the repository.

---

**Built with ❤️ using React Native and Expo**