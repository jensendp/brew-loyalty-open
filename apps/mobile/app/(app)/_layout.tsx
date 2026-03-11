import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1a1a1a',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#eee',
        },
        headerStyle: { backgroundColor: '#fafaf8' },
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="card"
        options={{
          title: 'My Card',
          tabBarLabel: 'Card',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎫</Text>,
        }}
      />
      <Tabs.Screen
        name="tiers"
        options={{
          title: 'Membership',
          tabBarLabel: 'Membership',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏆</Text>,
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarLabel: 'Rewards',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🎁</Text>,
        }}
      />
    </Tabs>
  )
}
