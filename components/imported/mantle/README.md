# Imported Mantle Components

This directory contains components imported from external projects related to the Mantle Network.

## Current Components

### MantleWidget

A simple widget that displays basic Mantle Network information. Currently implemented as a placeholder with mock data.

### MantleIntegration

A more advanced component featuring a tabbed interface to display:

- Recent transactions on the Mantle Network
- Token prices and information
- Network statistics and status

The component is designed to be a placeholder that showcases how external project code can be integrated into the application.

## Usage

```tsx
// Basic widget
import MantleWidget from "@/components/imported/mantle/MantleWidget";

// In your component
<MantleWidget />;

// Advanced integration
import MantleIntegration from "@/components/imported/mantle/MantleIntegration";

// In your component
<MantleIntegration />;
```

## Integration Process

When importing real components from external projects:

1. Place the component files in this directory
2. Update imports to use the correct paths
3. Ensure all dependencies are installed
4. Test the component in isolation before integrating
5. Replace the placeholder with the real component

### Key Considerations When Importing

1. **Dependencies**: Check if the external project uses libraries already in this project
2. **Styling**: Adjust the styling to match the glassmorphism design of this application
3. **Responsiveness**: Ensure components work on different screen sizes
4. **State Management**: Adapt to the state management pattern used in this project
5. **Data Fetching**: Replace mock data with real API calls

## Styling

The components follow the application's glassmorphism design with:

- Dark background with transparency (`bg-black/30`)
- Backdrop blur effect (`backdrop-blur-md`)
- White text with varying opacity for hierarchy
- Rounded corners and subtle borders
- Grid layouts for structured information display

## Future Additions

Additional components that could be added:

- MantleTransactionList (more detailed version)
- MantleBlockExplorer (with block details)
- MantleStakingInterface
- MantleGovernanceVoting
- MantleTokenSwap
