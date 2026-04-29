const fs = require('fs');
let c = fs.readFileSync('src/screens/SettingsScreen.js', 'utf8');

c = c.replace(/import \{ useIoTStore \} from '\.\.\/store\/useIoTStore';/, `import { useIoTStore } from '../store/useIoTStore';\nimport { useRealtimeData } from '../hooks/useRealtimeData';`);

c = c.replace(/export const SettingsScreen = \(\) => \{\n  const \{ settings, updateSettings \} = useIoTStore\(\);\n  const \[localThreshold, setLocalThreshold\] = useState\(\n    settings\.threshold\.toString\(\),\n  \);\n\n  useEffect\(\(\) => \{\n    setLocalThreshold\(settings\.threshold\.toString\(\)\);\n  \}, \[settings\.threshold\]\);\n\n  const handleSave = \(\) => \{\n    updateSettings\(\{\n      threshold: parseInt\(localThreshold, 10\) \|\| 1350,\n    \}\);\n  \};/, `export const SettingsScreen = () => {
  const { settings, updateSettings } = useIoTStore();
  const { data, actions } = useRealtimeData();
  const currentThreshold = data.controls.threshold || settings.threshold;
  
  const [localThreshold, setLocalThreshold] = useState(
    currentThreshold.toString(),
  );

  useEffect(() => {
    setLocalThreshold(currentThreshold.toString());
  }, [currentThreshold]);

  const handleSave = () => {
    const val = parseInt(localThreshold, 10) || 1350;
    updateSettings({
      threshold: val,
    });
    actions.setThreshold(val);
  };`);

c = c.replace(/Current value: \{settings\.threshold\}/, `Current value: {currentThreshold}`);

fs.writeFileSync('src/screens/SettingsScreen.js', c);
