const fs = require('fs');
const path = require('path');

const filesToRefactor = [
  "components/GoalMasterPlanModal.tsx",
  "components/WorkoutTimer.tsx",
  "components/WeeklyBarChart.tsx",
  "components/StatCard.tsx",
  "components/NotificationsModal.tsx",
  "components/ui/Button.tsx",
  "components/ui/Input.tsx",
  "components/EditProfileModal.tsx",
  "app/(tabs)/profile.tsx",
  "app/(tabs)/two.tsx",
  "app/(tabs)/progress.tsx",
  "app/(legal)/terms.tsx",
  "app/(tabs)/nutrition.tsx",
  "app/(legal)/privacy.tsx",
  "app/(tabs)/index.tsx",
  "app/(auth)/signup.tsx",
  "app/(auth)/onboarding.tsx",
  "app/(auth)/login.tsx"
];

for (const relPath of filesToRefactor) {
  const file = path.join('c:/source/repos2/FitPulse', relPath);
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('useStyles(colors)')) {
    console.log(`Skipping ${relPath} (already refactored)`);
    continue;
  }

  // Find depth to contexts
  const depth = (relPath.match(/\//g) || []).length;
  let contextPath = '../contexts/ThemeContext';
  if (depth === 2) contextPath = '../../contexts/ThemeContext';
  else if (depth === 3) contextPath = '../../../contexts/ThemeContext';
  
  if (!content.includes('useTheme')) {
    // Insert after react-native import, or top of file if not found
    if (content.includes("from 'react-native';")) {
      content = content.replace(/(from 'react-native';?)/, `$1\nimport { useTheme } from '${contextPath}';`);
    } else {
      content = `import { useTheme } from '${contextPath}';\n` + content;
    }
  }

  // Remove Colors import
  content = content.replace(/,\s*Colors/g, '');
  content = content.replace(/Colors,\s*/g, '');
  content = content.replace(/import\s*\{\s*Colors\s*\}\s*from.*Theme';\n/g, '');
  content = content.replace(/import\s*\{\s*\}\s*from.*Theme';\n/g, ''); // cleanup empty

  // Update StyleSheet.create to useStyles
  content = content.replace(/const styles = StyleSheet\.create\(\{/g, 'const useStyles = (colors: any) => StyleSheet.create({');

  // Inject hook into components
  // We look for `export default function Name(props) {`
  content = content.replace(/(export default function \w+\([^)]*\)\s*\{)/g, `$1\n  const { colors } = useTheme();\n  const styles = useStyles(colors);`);

  // Replace Colors. with colors.
  content = content.replace(/Colors\./g, 'colors.');

  fs.writeFileSync(file, content);
  console.log(`Refactored ${relPath}`);
}
