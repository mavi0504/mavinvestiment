import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ActivityIndicator, Alert, SafeAreaView, StatusBar, ScrollView
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const API = 'http://localhost/Aulas_PBE2\POO\gerson\investmind-Backend';

export default function AlertasScreen() {
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState({ ticker: '', preco: '', condicao: 'SUBIR' });
  const [alertas, setAlertas] = useState([]);
  const [favoritos, setFavoritos] = useState([
    { id: '1', ticker: 'MGLU3', preco: '2,15', var: '-0.50%' },
    { id: '2', ticker: 'ITUB4', preco: '32,10', var: '+1.20%' },
  ]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadAlerts(); }, []);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/get_alerts.php`);
      const data = await res.json();
      if (Array.isArray(data)) setAlertas(data);
    } catch {
      /* erro silencioso no carregamento inicial */
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = () => {
    if (!busca.trim()) return Alert.alert('Atenção', 'Digite um ticker.');
    setForm(prev => ({ ...prev, ticker: busca.toUpperCase().trim() }));
    Alert.alert('Sucesso', `Ativo ${busca.toUpperCase()} selecionado!`);
  };

  const handleCreate = async () => {
    if (!form.ticker || !form.preco) return Alert.alert('Atenção', 'Preencha Ticker e Preço.');
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/create_alert.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: form.ticker.toUpperCase().trim(),
          target_price: parseFloat(form.preco.replace(',', '.')),
          condition_type: form.condicao,
        }),
      });
      if (res.ok) {
        Alert.alert('Sucesso', 'Alerta cadastrado!');
        setForm({ ticker: '', preco: '', condicao: 'SUBIR' });
        loadAlerts();
      }
    } catch {
      Alert.alert('Erro', 'Falha ao conectar ao servidor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API}/delete_alert.php`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setAlertas(prev => prev.filter(a => a.id !== id));
    } catch {
      Alert.alert('Erro', 'Erro ao excluir.');
    }
  };

  const toggleFav = (t) => {
    if (!t) return;
    const tickerUpper = t.toUpperCase();
    setFavoritos(prev => 
      prev.some(f => f.ticker === tickerUpper)
        ? prev.filter(f => f.ticker !== tickerUpper)
        : [...prev, { id: String(Date.now()), ticker: tickerUpper, preco: '0,00', var: '0.00%' }]
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B1120" />
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        
        <Text style={s.titulo}>InvestMind 📈</Text>

        {/* Busca */}
        <View style={s.row}>
          <TextInput
            style={[s.input, { flex: 1 }]}
            placeholder="Digite o ticker (ex: MGLU3)..."
            placeholderTextColor="#64748B"
            value={busca}
            onChangeText={setBusca}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={s.btnPrimary} onPress={handleBuscar}>
            <Text style={s.btnText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="small" color="#0066CC" style={{ marginVertical: 8 }} />}

        {/* Card Novo Alerta */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Novo Alerta</Text>

          <Text style={s.label}>ATIVO (TICKER)</Text>
          <View style={s.inputFavRow}>
            <TextInput
              style={[s.input, { flex: 1, borderWidth: 0 }]}
              placeholder="EX: PETR4"
              placeholderTextColor="#64748B"
              value={form.ticker}
              onChangeText={val => setForm({ ...form, ticker: val })}
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={() => toggleFav(form.ticker)}>
              <FontAwesome 
                name={favoritos.some(f => f.ticker === form.ticker.toUpperCase()) ? "star" : "star-o"} 
                size={18} 
                color="#F59E0B" 
              />
            </TouchableOpacity>
          </View>

          <Text style={s.label}>PREÇO ALVO (R$)</Text>
          <TextInput
            style={s.input}
            placeholder="0,00"
            placeholderTextColor="#64748B"
            keyboardType="numeric"
            value={form.preco}
            onChangeText={val => setForm({ ...form, preco: val })}
          />

          <Text style={s.label}>CONDIÇÃO</Text>
          <View style={s.row}>
            {[
              { type: 'SUBIR', label: 'Subir (Venda)', icon: 'arrow-up-circle-outline', activeBg: s.bgGreen },
              { type: 'CAIR', label: 'Cair (Compra)', icon: 'arrow-down-circle-outline', activeBg: s.bgRed }
            ].map(item => (
              <TouchableOpacity
                key={item.type}
                style={[s.condBtn, form.condicao === item.type && item.activeBg]}
                onPress={() => setForm({ ...form, condicao: item.type })}
              >
                <Ionicons name={item.icon} size={16} color="#FFF" />
                <Text style={s.condText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[s.btnPrimary, { marginTop: 14 }]} onPress={handleCreate} disabled={submitting}>
            {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={s.btnText}>Cadastrar Alerta</Text>}
          </TouchableOpacity>
        </View>

        {/* Favoritos */}
        <Text style={s.sectionTitle}>Favoritos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {favoritos.map(f => (
            <View key={f.id} style={s.favCard}>
              <View style={s.rowBetween}>
                <Text style={s.bold}>{f.ticker}</Text>
                <FontAwesome name="star" size={12} color="#F59E0B" />
              </View>
              <Text style={s.subText}>R$ {f.preco}</Text>
              <Text style={{ color: f.var.startsWith('+') ? '#10B981' : '#EF4444', fontSize: 11, fontWeight: 'bold' }}>
                {f.var}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Alertas Ativos */}
        <Text style={s.sectionTitle}>Seus Alertas Ativos</Text>
        {alertas.length === 0 && !loading ? (
          <Text style={s.emptyText}>Nenhum alerta cadastrado no momento.</Text>
        ) : (
          alertas.map(a => (
            <View key={a.id} style={[s.card, s.rowBetween, { marginBottom: 8 }]}>
              <View>
                <Text style={s.bold}>{a.ticker}</Text>
                <Text style={s.subText}>Meta: R$ {parseFloat(a.target_price).toFixed(2)} ({a.condition_type})</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(a.id)}>
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B1120' },
  content: { padding: 14 },
  titulo: { fontSize: 22, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#F8FAFC', marginVertical: 8 },
  card: { backgroundColor: '#1E293B', borderRadius: 8, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 4 },
  label: { fontSize: 11, color: '#94A3B8', marginTop: 8, marginBottom: 4, fontWeight: '600' },
  row: { flexDirection: 'row', gap: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  input: { height: 40, backgroundColor: '#0F172A', borderRadius: 6, paddingHorizontal: 10, color: '#FFF', borderWidth: 1, borderColor: '#334155', fontSize: 13 },
  inputFavRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 6, borderWidth: 1, borderColor: '#334155', paddingRight: 10 },
  btnPrimary: { backgroundColor: '#0066CC', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 6 },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  condBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#0F172A', height: 38, borderRadius: 6, borderWidth: 1, borderColor: '#334155' },
  condText: { color: '#FFF', fontSize: 12 },
  bgGreen: { backgroundColor: '#059669', borderColor: '#10B981' },
  bgRed: { backgroundColor: '#DC2626', borderColor: '#EF4444' },
  favCard: { backgroundColor: '#1E293B', borderRadius: 6, padding: 8, width: 105, marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  bold: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
  subText: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  emptyText: { color: '#64748B', textAlign: 'center', marginVertical: 12, fontSize: 13 },
});