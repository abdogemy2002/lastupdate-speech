import backgroundImage from '../../assets/flower-bg.jpg';

export const styles = {
    root: {
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(253, 251, 246, 0.85), rgba(253, 251, 246, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        py: 6,
        display: 'flex',
        alignItems: 'center'
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        mb: 4,
        position: 'relative'
    },
    backButton: {
        color: '#fca43c',
        backgroundColor: '#FDFBF6',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        fontFamily: "'Tajawal', sans-serif",
        borderRadius: '8px',
        px: 3,
        py: 1,
        boxShadow: '0 2px 8px rgba(252, 164, 60, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#fca43c',
            color: '#fff',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(252, 164, 60, 0.3)'
        }
    },
    pageTitle: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fca43c',
        fontWeight: 'bold',
        fontSize: '2rem',
        textAlign: 'center',
        backgroundColor: '#FDFBF6',
        p: 2,
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '2px solid rgba(252, 164, 60, 0.3)',
        width: 'fit-content',
        mx: 'auto',
        mb: 4
    },
    dateNavigation: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        mb: 4,
        fontFamily: "'Tajawal', sans-serif",
        borderRadius: '12px',
        p: 2,
        backgroundColor: 'rgba(253, 251, 246, 0.9)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxWidth: 'fit-content',
        mx: 'auto'
    },
    navIconButton: {
        color: '#20B2AA',
        backgroundColor: '#FDFBF6',
        borderRadius: '50%',
        width: 40,
        height: 40,
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#fca43c',
            color: '#fff',
            transform: 'scale(1.1)'
        },
        '&.Mui-disabled': {
            backgroundColor: '#f0f0f0',
            color: '#cccccc'
        }
    },
    dateText: {
        fontWeight: 'bold',
        color: '#20B2AA',
        fontFamily: "'Tajawal', sans-serif",
        backgroundColor: '#FDFBF6',
        px: 3,
        py: 1,
        borderRadius: '8px',
        minWidth: 250,
        textAlign: 'center',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    timeSlotButton: {
        minWidth: '100px',
        py: 1.5,
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: "'Tajawal', sans-serif",
        color: '#20B2AA',
        backgroundColor: '#FDFBF6',
        border: '2px solid #20B2AA',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#fca43c',
            color: '#fff',
            borderColor: '#fca43c',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(252, 164, 60, 0.3)'
        },
        '&.MuiButton-contained': {
            backgroundColor: '#fca43c',
            color: '#fff',
            borderColor: '#fca43c',
            '&:hover': {
                backgroundColor: '#e5942a',
                transform: 'translateY(-2px)'
            }
        }
    },
    packagesTitle: {
        mb: 3,
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        textAlign: 'center',
        textShadow: '1px 1px 3px rgba(0,0,0,0.2)'
    },
    packageCard: {
        border: '2px solid #FDFBF6',
        borderRadius: '16px',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(253, 251, 246, 0.95)',
        fontFamily: "'Tajawal', sans-serif",
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 24px rgba(252, 164, 60, 0.3)',
            borderColor: '#fca43c'
        }
    },
    selectedPackage: {
        border: '3px solid #FCA43C',
        backgroundColor: '#fff',
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 24px rgba(252, 164, 60, 0.4) !important'
    },
    packageTitle: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fca43c',
        fontWeight: 'bold',
        mb: 1,
        fontSize: '1.25rem'
    },
    packageDescription: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#555',
        mb: 2,
        lineHeight: 1.6
    },
    priceBox: {
        backgroundColor: 'rgba(32, 178, 170, 0.15)',
        borderRadius: '12px',
        p: 2,
        textAlign: 'center',
        marginTop: 'auto',
        border: '1px solid rgba(32, 178, 170, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(32, 178, 170, 0.25)'
        }
    },
    priceText: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#20B2AA',
        fontWeight: 'bold',
        fontSize: '1.5rem',
        letterSpacing: '1px'
    },
    bookButton: {
        backgroundColor: '#FCA43C',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        px: 6,
        py: 1.5,
        borderRadius: '12px',
        fontFamily: "'Tajawal', sans-serif",
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(252, 164, 60, 0.3)',
        '&:hover': {
            backgroundColor: '#e5942a',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(252, 164, 60, 0.4)'
        }
    },
    disabledButton: {
        backgroundColor: '#e0e0e0 !important',
        color: '#9e9e9e !important',
        cursor: 'not-allowed',
        boxShadow: 'none !important',
        transform: 'none !important'
    },
    timeSlotsContainer: {
        backgroundColor: 'rgba(32, 178, 170, 0.9)',
        borderRadius: '16px',
        p: 3,
        mb: 4,
        boxShadow: '0 8px 24px rgba(32, 178, 170, 0.2)',
        border: '3px solid #FcAB3C',
        backdropFilter: 'blur(5px)'
    },
    packagesContainer: {
        backgroundColor: 'rgba(32, 178, 170, 0.9)',
        borderRadius: '16px',
        p: 4,
        mb: 4,
        boxShadow: '0 8px 24px rgba(32, 178, 170, 0.2)',
        border: '3px solid #FcAB3C',
        backdropFilter: 'blur(5px)'
    },
    errorText: {
        color: '#ff1744',
        fontFamily: "'Tajawal', sans-serif",
        mb: 2,
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: 'rgba(255, 23, 68, 0.1)',
        p: 1,
        borderRadius: '4px'
    },
    detailsCard: {
        height: '100%',
        borderRadius: '16px',
        backgroundColor: 'rgba(253, 251, 246, 0.95)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        border: '2px solid rgba(252, 164, 60, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(252, 164, 60, 0.2)'
        }
    },
    paymentCard: {
        borderRadius: '16px',
        backgroundColor: 'rgba(253, 251, 246, 0.95)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        border: '2px solid rgba(32, 178, 170, 0.3)',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 28px rgba(32, 178, 170, 0.2)'
        }
    },
    sectionTitle: {
        color: '#fca43c',
        mb: 3,
        fontWeight: 'bold',
        fontSize: '1.25rem',
        borderBottom: '2px solid rgba(252, 164, 60, 0.3)',
        pb: 1,
        fontFamily: "'Tajawal', sans-serif"
    },
    detailLabel: {
        color: '#20B2AA',
        mb: 0.5,
        fontWeight: 'bold',
        fontFamily: "'Tajawal', sans-serif"
    },
    detailsStack: {
        mt: 2,
        '& > *': {
            borderBottom: '1px dashed rgba(32, 178, 170, 0.2)',
            pb: 1.5,
            '&:last-child': {
                borderBottom: 'none'
            }
        }
    },
    loadingBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '300px',
        borderRadius: '16px',
        backgroundColor: 'rgba(253, 251, 246, 0.7)'
    },
    loadingText: {
        mt: 2,
        color: '#20B2AA',
        fontWeight: 'bold',
        fontFamily: "'Tajawal', sans-serif"
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        backgroundColor: 'rgba(253, 251, 246, 0.9)',
        borderRadius: '16px',
        p: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
    },
    errorAlert: {
        width: '100%',
        maxWidth: '500px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
};