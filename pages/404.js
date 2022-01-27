import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import appConfig from '../config.json';




export default function PaginaDeErrro(){
    return(
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center',
                    // backgroundColor: appConfig.theme.colors.primary[500],
                    backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2021/02/drakeposting-negative-meme.jpg)',
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                }}
            >
                <Text
                    styleSheet={{
                        color: appConfig.theme.colors.neutrals['000'],
                        fontSize: '40px',
                        width: '90vw',
                        textAlign: 'end',
                    }}
                
                >Página não encontrada. Erro 404!</Text>
            </Box>
        </>       
    )
}