import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITOS_KEY ='@investmind_favoritos';

export const salvarFavorito = async (ticker) => {
    try {
        const atuais = await obterFavoritos();
        const tickerUpper = ticker.toUpperCase();
        if (!atuais.includes(tickerUpper)) {
            const novos = [...atuais, tickerUpper];
            await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novos));
        }
    } catch (e) {
        console.error('Erro ao salvar favorito:', e);
    }
};

export const obterFavoritos = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITOS_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : ['PETR4', 'VALUE3', 'ITUB4'];
    } catch (e) {
        return ['PETR4', 'VALUE3', 'ITUB4'];
    }
};


export const removerFavorito = async (ticker) => {
    try {
        const atuais = await obterFavoritos();
        const novos = atuais.filter((t) => t !== ticker.toUpperCase());
        await AsyncStorage.setItem(FAVORITOS_KEY, JSON.stringify(novos));
    } catch (e) {
        console.error('Erro ao remover favorito:', e);
    }
};