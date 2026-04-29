const fs = require('fs');
let c = fs.readFileSync('src/screens/DashboardScreen.js', 'utf8');

c = c.replace(/\{\/\* HEADER \*\/\}[\s\S]*?\{\/\* CIRCLE METER \*\/\}/, `{\/* HEADER *\/}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Smart Gas</Text>
            <Text style={styles.subtitle}>
              {isDanger ? 'Gas Leak Detected' : 'All systems normal.'}
            </Text>
          </View>
          <Pressable 
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <Settings color="#a0abc0" size={24} />
          </Pressable>
        </View>

        {\/* CIRCLE METER *\/}`);

c = c.replace(/title: \{ fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 \},\r?\n\s*subtitle: \{ fontSize: 16, color: '#a0abc0', marginBottom: 32 \},/, `header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#a0abc0' },
  settingsBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#151e2f', justifyContent: 'center', alignItems: 'center' },`);

fs.writeFileSync('src/screens/DashboardScreen.js', c);
