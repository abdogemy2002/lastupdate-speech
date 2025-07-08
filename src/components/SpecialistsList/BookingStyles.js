import backgroundImage from '../../assets/flower-bg.jpg';

export const styles = {
    root: {
        minHeight: '100vh',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: 6
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        mb: 4
    },
    backButton: {
        color: '#fca43c',
        backgroundColor: '#FDFBF6',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        fontFamily: "'Tajawal', sans-serif",
        '&:hover': {
            backgroundColor: 'rgba(32, 178, 170, 0.1)'
        }
    },
    pageTitle: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fca43c',
        fontWeight: 'bold',
        flexGrow: 1,
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        p: 1,
        borderRadius: '8px'
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
        
    },
    navIconButton: {
        color: '#20B2AA',
        backgroundColor: '#FDFBF6',
        '&:hover': {
            backgroundColor: '#fca43c',
            color: '#fff'
        },
        '&.Mui-disabled': {
            backgroundColor: '#f0f0f0',
            color: '#cccccc'
        }
    },
    dateText: {
        fontWeight: 'bold',
        color: '#000',
        fontFamily: "'Tajawal', sans-serif",
        backgroundColor: '#FDFBF6',
        px: 3,
        py: 1,
        borderRadius: '8px'
    },
    timeSlotButton: {
        minWidth: '100px',
        py: 1.5,
        fontSize: '16px',
        fontWeight: 'bold',
        fontFamily: "'Tajawal', sans-serif",
        color: '#20B2AA',
        backgroundColor: '#FDFBF6',
        borderColor: '#20B2AA',
        '&:hover': {
            backgroundColor: '#fca43c',
            color: '#fff',
            borderColor: '#1a9c95'
        },
        '&.MuiButton-contained': {
            backgroundColor: '#fca43c',
            color: '#fff',
            '&:hover': {
                backgroundColor: '#e5942a'
            }
        }
    },
    packagesTitle: {
        mb: 3,
        fontFamily: "'Tajawal', sans-serif",
        color: '#fff',
        fontWeight: 'bold'
    },
    packageCard: {
        border: '2px solid #FDFBF6',
        borderRadius: 3,
        transition: '0.3s',
        backgroundColor: 'rgba(253, 251, 246, 0.9)',
        fontFamily: "'Tajawal', sans-serif",
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        '&:hover': {
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            borderColor: '#fca43c'
        }
    },
    selectedPackage: {
        border: '3px solid #FCA43C',
        backgroundColor: 'rgb(255, 255, 255)'
    },
    packageTitle: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#fca43c',
        fontWeight: 'bold',
        mb: 1
    },
    packageDescription: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#555',
        mb: 2
    },
    priceBox: {
        backgroundColor: 'rgba(32, 178, 170, 0.2)',
        borderRadius: '8px',
        p: 2,
        textAlign: 'center',
    },
    priceText: {
        fontFamily: "'Tajawal', sans-serif",
        color: '#20B2AA',
        fontWeight: 'bold',
        fontSize: '1.25rem',
    },
    bookButton: {
        backgroundColor: '#FCA43C',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        px: 5,
        py: 1.5,
        borderRadius: '12px',
        fontFamily: "'Tajawal', sans-serif",
        '&:hover': {
            backgroundColor: '#e5942a',
        }
    },
    disabledButton: {
        backgroundColor: '#cccccc',
        color: '#666666',
        cursor: 'not-allowed'
    },
    timeSlotsContainer: {
        backgroundColor: '#20B2AA',
        borderRadius: '16px',
        p: 3,
        mb: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        border: '3px solid #FcAB3C',
    },
    packagesContainer: {
        backgroundColor: '#20B2AA',
        borderRadius: '16px',
        p: 4,
        mb: 4,
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        border: '3px solid #FcAB3C',
    },
    errorText: {
        color: '#ff1744',
        fontFamily: "'Tajawal', sans-serif",
        mb: 2,
        textAlign: 'center'
    }
};