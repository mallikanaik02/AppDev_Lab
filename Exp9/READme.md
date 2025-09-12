# Experiment 9: Flutter SDK + Calculator UI

Part a:

## Aim
To set up Flutter development environment and create a calculator UI with basic layout design.

## Steps Followed
1. Set up Flutter SDK and added to PATH
2. Created new Flutter project using `flutter create calculator_app`
3. Implemented CalculatorApp and CalculatorUI classes
4. Designed 4x4 button grid layout using Row/Column widgets
5. Applied styling with Material Design components

## Features
- Black background with white text display
- 16 calculator buttons in grid layout
- Orange operation buttons (+, -, ×, ÷, =)
- Grey number buttons (0-9, .)
- Rounded corners and responsive design

## Screenshot
![Calculator UI](cal.png)


part b:
## Aim
Implement functional calculator logic with arithmetic operations and state management.

## Changes Made
1. **StatefulWidget**: Converted CalculatorUI to StatefulWidget for state management
2. **Button Logic**: Added onButtonPressed() handler for all button interactions  
3. **Calculator Functions**: Implemented calculate() method for +, -, ×, ÷ operations
4. **State Updates**: Used setState() to update display in real-time
5. **Clear Functions**: Added AC (All Clear) and C (Clear) buttons

## Features Working
- ✅ Basic arithmetic: 5 + 3 = 8
- ✅ Decimal support: 3.5 × 2 = 7.0  
- ✅ Clear functions: AC/C buttons
- ✅ Real-time display updates
- ✅ Error handling (division by zero)



