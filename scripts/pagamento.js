// Polyfill para fetch em navegadores que não suportam
if (!window.fetch) {
    window.fetch = function(url, options) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(options.method || 'GET', url);
            xhr.onload = () => resolve({
                ok: xhr.status === 200,
                status: xhr.status,
                json: () => Promise.resolve(JSON.parse(xhr.responseText))
            });
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(options.body);
        });
    };
}

document.addEventListener('DOMContentLoaded', function() {
    // Recupera os dados do localStorage
    const dadosFormulario = JSON.parse(localStorage.getItem('dadosFormulario')) || {};

   // Verifica se os dados foram recuperados corretamente
   if (dadosFormulario) {
    console.log(dadosFormulario); // Exibe os dados no console para confirmação

    // Verifica se os elementos existem antes de tentar acessá-los
    // Verifica se o elemento existe antes de tentar acessá-lo
const valorTotalExibidoElement = document.querySelector('.total-value');
if (valorTotalExibidoElement) {
    valorTotalExibidoElement.innerText = `Valor Total: R$ ${dadosFormulario.valorTotal}`;
} else {
    console.warn('Elemento com a classe "total-value" não encontrado.');
}

} else {
    console.error('Nenhum dado encontrado no localStorage.');
}

const btnRedirect = document.getElementById('btnRedirect');

if (btnRedirect) {
    btnRedirect.addEventListener('click', function(event) {
        // Impede o redirecionamento por padrão
        if (dadosFormulario.formaPagamento === 'credito') {
            const installmentSelect = document.getElementById('installment-select');
            if (!installmentSelect || !installmentSelect.value) {
                alert('Por favor, selecione o número de parcelas antes de prosseguir.');
                event.preventDefault(); // Impede o redirecionamento
            }
        }
    });
} else {
    console.warn('Elemento "btnRedirect" não encontrado.');
}

// Função para atualizar as opções de parcelas com base na data atual
function atualizarOpcoesParcelas() {
    const installmentSelect = document.getElementById('installment-select');
    const dataAtual = new Date();
    const mesAtual = dataAtual.getMonth(); // Janeiro = 0, Dezembro = 11
    const anoAtual = dataAtual.getFullYear();

    // Lógica para definir o número máximo de parcelas
    let maxParcelas = 5; // Padrão para novembro e dezembro de 2024
    if (anoAtual === 2025) {
        switch (mesAtual) {
            case 0: // Janeiro
                maxParcelas = 4;
                break;
            case 1: // Fevereiro
                maxParcelas = 3;
                break;
            case 2: // Março
                maxParcelas = 2;
                break;
            }
    }

        // Limpa as opções existentes
        installmentSelect.innerHTML = '<option value="">Selecione o número de parcelas</option>';

        // Adiciona as opções de parcelas conforme o máximo permitido
        for (let i = 1; i <= maxParcelas; i++) {
            const valorParcela = (dadosFormulario.valorTotal / i).toFixed(2);
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de R$ ${valorParcela}`;
            installmentSelect.appendChild(option);
        }
    }

    // Configuração das opções de pagamento
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    const installments = document.querySelector('.shared-installments');
    const qrCodeSection = document.getElementById('qrCodeSection');
    const needHelpCheckbox = document.getElementById('needHelp');
    const contactButton = document.getElementById('contactButton');
    const finalizarButton = document.getElementById('finalizarCadastro');

    // Oculta a selectbox ao carregar a página
    if (installments) {
        installments.style.display = 'none';
    }

    if (paymentOptions.length > 0 && paymentDetails.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                paymentOptions.forEach(opt => opt.classList.remove('selected'));

                // Add selected class to clicked option
                this.classList.add('selected');

                // Get the payment method
                const method = this.dataset.method;
                dadosFormulario.formaPagamento = method; // Armazena a forma de pagamento

                // Hide all payment details
                paymentDetails.forEach(detail => detail.style.display = 'none');

                // Show selected payment details
                const methodDetails = document.getElementById(`${method}Details`);
                if (methodDetails) {
                    methodDetails.style.display = 'block';
                } else {
                    console.warn(`Elemento "${method}Details" não encontrado.`);
                }

                // Mostrar a caixa de seleção de parcelas para todos os métodos
                if (installments) {
                    installments.style.display = 'block';
                    atualizarOpcoesParcelas(); // Atualiza as opções de parcelas para todos os métodos
                }

                // Mostrar apenas a seção QR code para a opção de crédito
                if (qrCodeSection) {
                    qrCodeSection.style.display = (method === 'credito') ? 'block' : 'none';
                }

                // Select the radio button
                const radioButton = this.querySelector('input[type="radio"]');
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
        });
    } else {
        console.warn('Nenhuma opção de pagamento ou detalhes de pagamento encontrados.');
    }

    if (needHelpCheckbox && contactButton) {
        needHelpCheckbox.addEventListener('change', function() {
            contactButton.style.display = this.checked ? 'block' : 'none';
        });
    } else {
        console.warn('Elemento "needHelp" ou "contactButton" não encontrado.');
    }

    if (finalizarButton) {
        finalizarButton.addEventListener('click', function() {
            const selectedPaymentOption = document.querySelector('.payment-option.selected');
            if (!selectedPaymentOption) {
                alert('Por favor, selecione uma forma de pagamento.');
                return;
            }

            if (dadosFormulario.formaPagamento === 'pix') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }else if(dadosFormulario.formaPagamento === 'credito') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }
            else if(dadosFormulario.formaPagamento === 'dinheiro') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }

            localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));
            console.log('Dados registrados ao finalizar cadastro:', dadosFormulario);

            fetch('/.netlify/functions/proxy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosFormulario)
            })
            .then(response => {
                console.log('Resposta do envio dos dados para proxy:', response);
                if (!response.ok) {
                    throw new Error('Erro ao enviar dados do formulário');
                }
                console.log('Dados enviados com sucesso!');
            })
            .catch(error => {
                console.error('Erro no fetch:', error);
            });


            async function sendEmail(emailSend, nome) {
                console.log('Iniciando função sendEmail com os dados:', { emailSend, nome });
                
                try {
                    const response = await fetch('/.netlify/functions/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: emailSend, nome: nome }),
                    });

                    console.log('Resposta do envio de e-mail:', response);

                    if (!response.ok) {
                        const errorText = await response.text();
                        console.error('Erro ao enviar email:', errorText);
                    } else {
                        console.log('Email enviado com sucesso!');
                    }
                } catch (error) {
                    console.error('Erro na requisição de envio de email:', error);
                }
            }

            // Extração do nome e email do localStorage para enviar o email
            const nome = dadosFormulario.principal?.nome || '';
            const emailSend = dadosFormulario.principal?.email || '';
            console.log('Nome e email extraídos para envio do email:', { nome, emailSend });

            sendEmail(emailSend, nome); // Aguarde o envio do e-mail

            // Redireciona para a próxima página apenas após todas as operações estarem concluídas
            console.log('Redirecionando para a página de confirmação.');
            //window.location.href = 'confirmacao-inscricao.html';

            setTimeout(() => {
                window.location.href = 'confirmacao-inscricao.html';
            }, 500);  // 500 ms de atraso            

                   });
                }
            });




/*document.addEventListener('DOMContentLoaded', function() {
    // Recupera os dados do localStorage
    const dadosFormulario = JSON.parse(localStorage.getItem('dadosFormulario')) || {};

    // Verifica se os dados foram recuperados corretamente
    if (dadosFormulario) {
        console.log(dadosFormulario); // Exibe os dados no console para confirmação

        // Verifica se os elementos existem antes de tentar acessá-los
        // Verifica se o elemento existe antes de tentar acessá-lo
    const valorTotalExibidoElement = document.querySelector('.total-value');
    if (valorTotalExibidoElement) {
        valorTotalExibidoElement.innerText = `Valor Total: R$ ${dadosFormulario.valorTotal}`;
    } else {
        console.warn('Elemento com a classe "total-value" não encontrado.');
    }

    } else {
        console.error('Nenhum dado encontrado no localStorage.');
    }

    const btnRedirect = document.getElementById('btnRedirect');

    if (btnRedirect) {
        btnRedirect.addEventListener('click', function(event) {
            // Impede o redirecionamento por padrão
            if (dadosFormulario.formaPagamento === 'credito') {
                const installmentSelect = document.getElementById('installment-select');
                if (!installmentSelect || !installmentSelect.value) {
                    alert('Por favor, selecione o número de parcelas antes de prosseguir.');
                    event.preventDefault(); // Impede o redirecionamento
                }
            }
        });
    } else {
        console.warn('Elemento "btnRedirect" não encontrado.');
    }

    // Função para atualizar as opções de parcelas com base na data atual
    function atualizarOpcoesParcelas() {
        const installmentSelect = document.getElementById('installment-select');
        const dataAtual = new Date();
        const mesAtual = dataAtual.getMonth(); // Janeiro = 0, Dezembro = 11
        const anoAtual = dataAtual.getFullYear();

        // Lógica para definir o número máximo de parcelas
        let maxParcelas = 5; // Padrão para novembro e dezembro de 2024
        if (anoAtual === 2025) {
            switch (mesAtual) {
                case 0: // Janeiro
                    maxParcelas = 4;
                    break;
                case 1: // Fevereiro
                    maxParcelas = 3;
                    break;
                case 2: // Março
                    maxParcelas = 2;
                    break;
                }
        }

        // Limpa as opções existentes
        installmentSelect.innerHTML = '<option value="">Selecione o número de parcelas</option>';

        // Adiciona as opções de parcelas conforme o máximo permitido
        for (let i = 1; i <= maxParcelas; i++) {
            const valorParcela = (dadosFormulario.valorTotal / i).toFixed(2);
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `${i}x de R$ ${valorParcela}`;
            installmentSelect.appendChild(option);
        }
    }

    // Configuração das opções de pagamento
    const paymentOptions = document.querySelectorAll('.payment-option');
    const paymentDetails = document.querySelectorAll('.payment-details');
    const installments = document.querySelector('.shared-installments');
    const qrCodeSection = document.getElementById('qrCodeSection');
    const needHelpCheckbox = document.getElementById('needHelp');
    const contactButton = document.getElementById('contactButton');
    const finalizarButton = document.getElementById('finalizarCadastro');

    // Oculta a selectbox ao carregar a página
    if (installments) {
        installments.style.display = 'none';
    }

    if (paymentOptions.length > 0 && paymentDetails.length > 0) {
        paymentOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                paymentOptions.forEach(opt => opt.classList.remove('selected'));

                // Add selected class to clicked option
                this.classList.add('selected');

                // Get the payment method
                const method = this.dataset.method;
                dadosFormulario.formaPagamento = method; // Armazena a forma de pagamento

                // Hide all payment details
                paymentDetails.forEach(detail => detail.style.display = 'none');

                // Show selected payment details
                const methodDetails = document.getElementById(`${method}Details`);
                if (methodDetails) {
                    methodDetails.style.display = 'block';
                } else {
                    console.warn(`Elemento "${method}Details" não encontrado.`);
                }

                // Mostrar a caixa de seleção de parcelas para todos os métodos
                if (installments) {
                    installments.style.display = 'block';
                    atualizarOpcoesParcelas(); // Atualiza as opções de parcelas para todos os métodos
                }

                // Mostrar apenas a seção QR code para a opção de crédito
                if (qrCodeSection) {
                    qrCodeSection.style.display = (method === 'credito') ? 'block' : 'none';
                }

                // Select the radio button
                const radioButton = this.querySelector('input[type="radio"]');
                if (radioButton) {
                    radioButton.checked = true;
                }
            });
        });
    } else {
        console.warn('Nenhuma opção de pagamento ou detalhes de pagamento encontrados.');
    }

    if (needHelpCheckbox && contactButton) {
        needHelpCheckbox.addEventListener('change', function() {
            contactButton.style.display = this.checked ? 'block' : 'none';
        });
    } else {
        console.warn('Elemento "needHelp" ou "contactButton" não encontrado.');
    }

    if (finalizarButton) {
        finalizarButton.addEventListener('click', function() {
            const selectedPaymentOption = document.querySelector('.payment-option.selected');
            if (!selectedPaymentOption) {
                alert('Por favor, selecione uma forma de pagamento.');
                return;
            }

            if (dadosFormulario.formaPagamento === 'pix') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }else if(dadosFormulario.formaPagamento === 'credito') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }
            else if(dadosFormulario.formaPagamento === 'dinheiro') {
                const installmentSelect = document.getElementById('installment-select');
                if (installmentSelect && installmentSelect.value) {
                    dadosFormulario.numeroParcelas = installmentSelect.value;
                    dadosFormulario.valorParcela = (dadosFormulario.valorTotal / installmentSelect.value).toFixed(2);
                } else {
                    alert('Por favor, selecione o número de parcelas.');
                    return;
                }
            }
        
            localStorage.setItem('dadosFormulario', JSON.stringify(dadosFormulario));
            console.log('Dados registrados ao finalizar cadastro:', dadosFormulario);

            fetch('/.netlify/functions/proxy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosFormulario)
                }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Erro ao enviar dados do formulário');
                }).catch(error => {
                console.error('Erro no fetch:', error);
            });

            // Função para enviar o email
            async function sendEmail(emailSend, nome) {
                try {
                const response = await fetch('/.netlify/functions/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                    email: emailSend,
                    nome: nome,
                    }),
                });
            
                if (response.ok) {
                    console.log('Email enviado com sucesso!');
                } else {
                    const errorText = await response.text();
                    console.error('Erro ao enviar email:', errorText);
                }
                } catch (error) {
                console.error('Erro na requisição de envio de email:', error);
                }
            }

            // Extração do nome e email do localStorage para enviar o email
            const nome = dadosFormulario.principal.nome;
            const emailSend = dadosFormulario.principal.email;


            // Chama a função para enviar o email com nome e email do formulário
            sendEmail(emailSend, nome);


            // Redireciona para a próxima página
            window.location.href = 'confirmacao-inscricao.html';
        });
    }
});*/