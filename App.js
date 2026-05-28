import 'react-native-gesture-handler';

import { createElement, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { WebView } from 'react-native-webview';

const Drawer = createDrawerNavigator();

const googleUrl = 'https://www.google.com';

const initialChartItems = [
  { id: '1', name: 'Jan', value: 18 },
  { id: '2', name: 'Fev', value: 24 },
  { id: '3', name: 'Mar', value: 20 },
  { id: '4', name: 'Abr', value: 31 },
  { id: '5', name: 'Mai', value: 36 },
  { id: '6', name: 'Jun', value: 42 },
];

const chartColors = ['#0F766E', '#2563EB', '#F97316', '#7C3AED', '#DC2626', '#0891B2'];

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
  decimalPlaces: 0,
  labelColor: () => '#64748B',
  propsForBackgroundLines: {
    stroke: '#E2E8F0',
  },
};

function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>Dashboard simples</Text>
      <Text style={styles.title}>App com menu lateral e rotas</Text>
      <Text style={styles.text}>
        Use o menu lateral para navegar entre as tres paginas. O app tem uma pagina inicial,
        uma WebView carregando um site e uma area com graficos.
      </Text>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>3</Text>
          <Text style={styles.metricLabel}>Paginas</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>2</Text>
          <Text style={styles.metricLabel}>Graficos</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>1</Text>
          <Text style={styles.metricLabel}>WebView</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function WebViewScreen() {
  return (
    <View style={styles.webContainer}>
      <View style={styles.webHeader}>
        <Text style={styles.webTitle}>WebView</Text>
        <Text style={styles.webSubtitle}>Abrindo google.com dentro do app</Text>
      </View>
      {Platform.OS === 'web' ? (
        createElement('iframe', {
          src: googleUrl,
          title: 'Google',
          style: { border: 0, flex: 1, minHeight: 420, width: '100%' },
        })
      ) : (
        <WebView source={{ uri: googleUrl }} startInLoadingState style={styles.webView} />
      )}
    </View>
  );
}

function ChartsScreen() {
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(width - 32, 560);
  const [items, setItems] = useState(initialChartItems);
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [formError, setFormError] = useState('');

  const chartData = useMemo(
    () => ({
      labels: items.map((item) => item.name),
      datasets: [
        {
          data: items.map((item) => item.value),
          color: () => '#0F766E',
          strokeWidth: 3,
        },
      ],
    }),
    [items]
  );

  const pieData = useMemo(
    () =>
      items.map((item, index) => ({
        name: item.name,
        value: item.value,
        color: chartColors[index % chartColors.length],
        legendFontColor: '#334155',
        legendFontSize: 13,
      })),
    [items]
  );

  function addItem() {
    const parsedValue = Number.parseFloat(value.replace(',', '.'));

    if (!name.trim()) {
      setFormError('Informe um nome para o dado.');
      return;
    }

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      setFormError('Informe um valor maior que zero.');
      return;
    }

    setItems((currentItems) => [
      ...currentItems,
      {
        id: `${Date.now()}`,
        name: name.trim(),
        value: parsedValue,
      },
    ]);
    setName('');
    setValue('');
    setFormError('');
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.kicker}>Relatorio</Text>
      <Text style={styles.title}>Graficos</Text>
      <Text style={styles.text}>
        Adicione dados para atualizar os graficos. Remova itens da lista para tirar os pontos
        dos graficos.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.cardTitle}>Novo dado</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Nome. Ex: Julho"
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Valor. Ex: 50"
          placeholderTextColor="#94A3B8"
          keyboardType="numeric"
          style={styles.input}
        />
        {formError ? <Text style={styles.errorText}>{formError}</Text> : null}
        <View style={styles.actionsRow}>
          <Pressable style={styles.primaryButton} onPress={addItem}>
            <Text style={styles.primaryButtonText}>Adicionar</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => setItems([])}>
            <Text style={styles.secondaryButtonText}>Remover todos</Text>
          </Pressable>
        </View>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Nenhum dado cadastrado</Text>
          <Text style={styles.emptyText}>Adicione um nome e um valor para mostrar os graficos.</Text>
        </View>
      ) : (
        <>
          <View style={styles.dataCard}>
            <Text style={styles.cardTitle}>Dados cadastrados</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.dataRow}>
                <View>
                  <Text style={styles.dataName}>{item.name}</Text>
                  <Text style={styles.dataValue}>{item.value}</Text>
                </View>
                <Pressable style={styles.removeButton} onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeButtonText}>Remover</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Valores por registro</Text>
            <LineChart
              data={chartData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>

          <View style={styles.chartCard}>
            <Text style={styles.cardTitle}>Participacao por registro</Text>
            <PieChart
              data={pieData}
              width={chartWidth}
              height={220}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="8"
              absolute
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Drawer.Navigator
          initialRouteName="Inicio"
          screenOptions={{
            drawerActiveTintColor: '#0F766E',
            drawerInactiveTintColor: '#475569',
            drawerStyle: styles.drawer,
            headerStyle: styles.header,
            headerTintColor: '#FFFFFF',
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Drawer.Screen name="Inicio" component={HomeScreen} />
          <Drawer.Screen name="WebView" component={WebViewScreen} />
          <Drawer.Screen name="Graficos" component={ChartsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F766E',
  },
  headerTitle: {
    fontWeight: '700',
  },
  page: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#F8FAFC',
    gap: 16,
  },
  kicker: {
    color: '#0F766E',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  text: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    minWidth: 100,
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricValue: {
    color: '#0F172A',
    fontSize: 34,
    fontWeight: '800',
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  webHeader: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
  },
  webTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
  },
  webSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 4,
  },
  webView: {
    flex: 1,
  },
  formCard: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    gap: 10,
  },
  input: {
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 8,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
  },
  dataCard: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
  },
  dataRow: {
    minHeight: 58,
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  dataName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  dataValue: {
    color: '#64748B',
    fontSize: 14,
    marginTop: 3,
  },
  removeButton: {
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  removeButtonText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  chartCard: {
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
  },
  cardTitle: {
    alignSelf: 'flex-start',
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  chart: {
    borderRadius: 8,
  },
});
