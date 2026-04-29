const fs = require('fs');
let c = fs.readFileSync('src/screens/SettingsScreen.js', 'utf8');

c = c.replace(/export const SettingsScreen[\s\S]*?const handleSave = \(\) => \{[\s\S]*?\n  \};/, `export const SettingsScreen = () => {
  const { settings, updateSettings } = useIoTStore();
  const { data, actions } = useRealtimeData();
  const currentThreshold = data?.controls?.threshold || settings.threshold;
  
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

fs.writeFileSync('src/screens/SettingsScreen.js', c);
