export const API_BASE_URL = 'http://localhost:8000/api';

export const buscarCotacao = async (ticker) => {
    try{
        const response = await fetch(`${API_BASE_URL}/cotacao?ticker=${ticker}`);
        const data = await response.json();
        if (data.results && data.results.legth > 0) {
            return data.results[0];
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar cotação:', error);
        return null;
    }
};

export const listarAlertas = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/alertas`);
        const data = await response.json();
        return data.dados || [];
    } catch (error) {
        console.error('Erro ao listar alertas:', error);
        return [];
    }
};

export const criarAlerta = async (alerta) => {
    try {
        const response = await fetch(`${API_BASE_URL}/alertas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                codigo_ativo: alerta.ticker || alerta.codigo_ativo,
                preco_alvo: parseFloat(alerta.preco_alvo),
                tipo_alerts: alerta.tipo || alerta.tipo_alerta || 'COMPRA'
            }),
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao criar alerta:', error);
        return false;
    }
};

export const deletarAlerta = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/alertas/${id}`, { 
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao deletar alerta:', error);
        return false;
    }
};