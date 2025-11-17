import axios from "axios";

/**
 * Configuração do cliente Axios para comunicação com a API
 * Define a URL base e headers padrão para todas as requisições
 * 
 * IMPORTANTE: Configure a variável de ambiente VITE_API_URL na Vercel
 */
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // Garante que status 200 e 201 sejam tratados como sucesso
    validateStatus: function (status) {
        return status >= 200 && status < 300; // Aceita 200, 201, 202, etc.
    },
});

// Interceptor de requisição para garantir headers corretos
api.interceptors.request.use(
    (config) => {
        // Se não for FormData, garante Content-Type JSON
        if (!(config.data instanceof FormData)) {
            config.headers['Content-Type'] = 'application/json';
        } else {
            // Para FormData, remove Content-Type para o browser definir automaticamente
            delete config.headers['Content-Type'];
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de resposta para garantir tratamento correto
api.interceptors.response.use(
    (response) => {
        // Retorna a resposta normalmente para status 200-299
        return response;
    },
    (error) => {
        // Trata erros de requisição
        if (error.response) {
            // O servidor respondeu com um status de erro
            const status = error.response.status;
            const data = error.response.data;
            
            // Log detalhado para debug
            console.error('Erro na resposta:', {
                status,
                message: data?.message || 'Erro desconhecido',
                errors: data?.errors || null,
                data: data
            });
            
            // Melhora mensagens de erro 400 (Bad Request)
            if (status === 400) {
                if (data?.errors) {
                    // Erros de validação do Laravel
                    const firstError = Object.values(data.errors)[0];
                    error.validationMessage = Array.isArray(firstError) ? firstError[0] : firstError;
                } else if (data?.message) {
                    error.validationMessage = data.message;
                }
            }
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            console.error('Erro na requisição: Sem resposta do servidor', error.request);
        } else {
            // Algo aconteceu ao configurar a requisição
            console.error('Erro ao configurar requisição:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;

