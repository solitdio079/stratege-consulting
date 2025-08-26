export default {
    fromId: {
        notEmpty: true,
        isLength: { options: { min: 24 } },
        errorMessage: 'Envoyeur invalid!',
        
    },
    toId: {
        notEmpty: true,
        isLength: { options: { min: 24 } },
        errorMessage: "Receveur invalid!",
    },
    content: {
        notEmpty: true,
        errorMessage: 'Votre message est invalide',
    },
   
}
