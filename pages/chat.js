import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';



const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI4MTc4NSwiZXhwIjoxOTU4ODU3Nzg1fQ.AtZcqVVaxuDInpyI_wXHYzuZugDpy0iXMaIpTsVMMlU';
const SUPABASE_URL = 'https://tozotstvsdssuhbsfkou.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escutaMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
      .from('mensagens')
      .on('INSERT', (respostaLive) => {
        adicionaMensagem(respostaLive.new);
      })
      .subscribe();
}
export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    

    React.useEffect(() => {
        supabaseClient
        .from('mensagens')
        .select('*')
        .order('id', { ascending: false })
        .then(({ data }) => {
            // console.log('Dados da consulta:', data);
            setListaDeMensagens(data);
        });

        const subscription = escutaMensagensEmTempoReal((novaMensagem) => {
            console.log('Nova mensagem:', novaMensagem);
            console.log('listaDeMensagens:', listaDeMensagens);
            // Quero reusar um valor de referencia (objeto/array) 
            // Passar uma função pro setState
      
            // setListaDeMensagens([
            //     novaMensagem,
            //     ...listaDeMensagens
            // ])
            setListaDeMensagens((valorAtualDaLista) => {
              console.log('valorAtualDaLista:', valorAtualDaLista);
              return [
                novaMensagem,
                ...valorAtualDaLista,
              ]
            });
          });
      
          return () => {
            subscription.unsubscribe();
          }
        }, []);
    

    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */
    function handleNovaMensagem(novaMensagem) {
        const mensagem = {
            // id: listaDeMensagens.length + 1,
            de: usuarioLogado,
            texto: novaMensagem,
        };

        supabaseClient
            .from('mensagens')
            .insert([
                mensagem
            ])
            .then(({ data }) => {
                // console.log('Criando mensagem', data);
                
            });

        
        setMensagem('');
    }

    function excluiMensagem(idMensagem) {
        const listaDeMensagensAtual = listaDeMensagens.filter((mensa, index) => {
            return mensa.id !== idMensagem;
            
        })
        
        setListaDeMensagens([
            ...listaDeMensagensAtual
        ]);
    }


    return (
 
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/07/futuristic-office.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >

            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        border: '1px solid #521CB0',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} deletMensagem={excluiMensagem}/>
                    {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
                    <Box
                        as="form"
                        onSubmit={function (enviarmensgem) {
                            enviarmensgem.preventDefault()
                            console.log('Alguem submeteu');
                            handleNovaMensagem(mensagem);
                            // window.location.href = '/chat';
                        }}
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        {/* CallBackk */}
                        <ButtonSendSticker 
                            onStickerClick={(sticker) => {
                                // console.log('Salva esse sticker');
                                handleNovaMensagem(':sticker: ' + sticker);
                            }}
                        />
                        <Button
                            type='submit'  
                            label='OK'
                            styleSheet={{
                                height: '45px',
                                width: '80px',
                                marginLeft: '10px',
                                marginTop: '0',
                                marginBottom: '8px',
                                backgroundColor: appConfig.theme.colors.neutrals[600],
                                border: `2px solid ${appConfig.theme.colors.primary[500]}`,
                                color:  appConfig.theme.colors.primary[500],
                                hover:{
                                    backgroundColor: appConfig.theme.colors.primary[500],
                                    color: appConfig.theme.colors.neutrals['000'],
                                }
                            }}
                            
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    label='Logout'
                    href="/"
                    styleSheet={{

                    }}
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflowY: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >

            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >   
                            
                            <a href={`https://github.com/${mensagem.de}`}>
                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    transition: '1.5s',
                                    hover: {
                                        cursor: 'pointer',
                                        width: '50px',
                                        height: '50px',
                                    }
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            >
                            </Image>
                            </a>
                            
                            
                            
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        
                        {/* Decrarativo */}
                        {/* Condicional: {mensagem.texto.startsWith(':sticker:').toString()} */}
                        {mensagem.texto.startsWith(':sticker:') 
                        ? (
                            <Image
                                styleSheet={{
                                    width: '150px',
                                }}
                            src={mensagem.texto.replace(':sticker:', '')} />
                        )
                        : (
                            mensagem.texto
                        )}
                        

                        <Box
                            styleSheet={{
                                textAlign: 'end',
                            }}
                        >
                            <Button
                                label='X'
                                styleSheet={{
                                    display: 'inline-block',
                                    padding: '3.5px',
                                    backgroundColor: appConfig.theme.colors.neutrals[900],
                                    color: appConfig.theme.colors.primary[500],
                                    hover: {
                                        cursor: 'pointer',
                                        backgroundColor: 'red',
                                        color: appConfig.theme.colors.neutrals['000'],
                                         
                                    }
                                }}
                                onClick={() => {
                                    props.deletMensagem(mensagem.id);
                                }}
                                  
                            />                          
                        </Box>
                    </Text>
                );
            })}
        </Box>
    )
}

