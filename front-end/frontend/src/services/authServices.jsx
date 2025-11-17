import api from "../axios";
import axios from "axios";

/**
 * Serviço de Autenticação
 * Centraliza todas as chamadas de API relacionadas à autenticação
 */

/**
 * Realiza o login do usuário
 * @param {Object} formData - Dados do formulário (email, password)
 * @returns {Promise<Object>} Resposta da API com token e dados do usuário
 */
export const loginService = async (formData) => {
    try {
        const response = await api.post('/login', formData);
        // Log para debug (pode ser removido em produção)
        console.log('Login response status:', response.status);
        console.log('Login response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro no login:', error);
        throw error;
    }
};

/**
 * Registra um novo usuário
 * @param {Object} formData - Dados do formulário (name, email, password)
 * @returns {Promise<Object>} Resposta da API com token e dados do usuário
 */
export const registerService = async (formData) => {
    try {
        const response = await api.post('/register', formData);
        // Log para debug (pode ser removido em produção)
        console.log('Register response status:', response.status);
        console.log('Register response data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro no registro:', error);
        throw error;
    }
};

/**
 * Atualiza os dados do usuário
 * Suporta atualização com ou sem upload de foto
 * @param {number} userId - ID do usuário a ser atualizado
 * @param {Object|FormData} data - Dados a serem atualizados
 * @param {string} token - Token de autenticação
 * @param {boolean} isFormData - Indica se os dados são FormData (para upload de arquivo)
 * @returns {Promise<Object>} Resposta da API com dados atualizados do usuário
 */
export const updateUserService = async (userId, data, token, isFormData = false) => {
    try {
        let response;
        
        // Se for FormData (upload de foto), usa uma instância do axios com configuração específica
            if (isFormData) {
                const axiosInstance = axios.create({
                    baseURL: import.meta.env.VITE_API_URL,
                headers: {
                    'Accept': 'application/json',
                },
                // Garante que status 200 e 201 sejam tratados como sucesso
                validateStatus: function (status) {
                    return status >= 200 && status < 300;
                },
            });

            // Envia como POST para suportar multipart/form-data
            response = await axiosInstance.post(`/update-user/${userId}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        } else {
            // Para dados JSON normais, usa PUT
            response = await api.put(`/update-user/${userId}`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
        }

        return response.data;
    } catch (error) {
        // Propaga o erro para ser tratado pelo componente
        console.error('Erro ao atualizar usuário:', error);
        throw error;
    }
};