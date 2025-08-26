
export default {
    postId: {
        notEmpty: true,
        isLength: { options: { min: 24 } },
        errorMessage: 'Post invalid!',
        
    },
    content: {
        notEmpty: true,
        errorMessage: 'Le contenu est invalide',
    },
   
}