export const mainBoxStyles = {
    p: 3,
    maxWidth: 800,
    mx: 'auto',
    pb: 6
};

export const chatButtonStyles = {
    mb: 4,
    mx: 'auto',
    display: 'flex',
    backgroundColor: '#20B2AA',
    color: 'white',
    fontFamily: "'Kidzhood Arabic', Arial, sans-serif",
    fontSize: '1.5rem',
    fontWeight: 'bold',
    borderRadius: '12px',
    padding: '12px 24px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '800px',
    justifyContent: 'flex-start',
    position: 'relative',
    '&:hover': {
        backgroundColor: '#1E9C96',
        transform: 'translateY(-2px)'
    }
};

export const headerBoxStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: 3,
    backgroundColor: '#E0F7FA',
    p: 2,
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

export const paginationStyles = {
    '& .MuiPaginationItem-root': {
        fontFamily: "'Tajawal', sans-serif",
        fontWeight: 'bold',
        fontSize: '1rem',
        minWidth: '36px',
        height: '36px'
    },
    '& .Mui-selected': {
        backgroundColor: '#FFA726!important',
        color: 'white',
        fontWeight: 'bold'
    }
};

export const noDoctorsStyles = {
    mt: 4,
    fontFamily: "'Tajawal', sans-serif",
    backgroundColor: '#FFF8E1',
    p: 3,
    borderRadius: '12px',
    border: '1px solid #FFD54F'
};

// DoctorCard styles
export const cardStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: '16px',
    border: '2px solid #FFA726',
    backgroundColor: '#20B2AA',
    overflow: 'hidden',
    minHeight: 170,
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
        transform: 'scale(1.01)',
        boxShadow: '0 4px 12px rgba(255, 167, 38, 0.3)'
    }
};

export const imageBoxStyles = {
    width: 220,
    minWidth: 220,
    overflow: 'hidden',
    '& img': {
        width: '100%',
        height: '101%',
        objectFit: 'cover',
        borderLeft: '2.5px solid #FFA726',
        borderBottomLeftRadius: '16px',
        borderTopLeftRadius: '16px'
    }
};

export const infoBoxStyles = {
    flex: 1,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
};

export const ratingBoxStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    flexWrap: 'wrap'
};

export const aboutTextStyles = {
    mt: 0.5,
    fontSize: '0.82rem',
    lineHeight: 1.4,
    height: '2.8em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    fontFamily: "'Tajawal', sans-serif",
    color: '#fff'
};

export const chipBoxStyles = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1,
    mt: 1
};

export const workingDaysBox = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 0.5
};

export const dayChip = {
    backgroundColor: '#B3E5FC',
    color: '#01579B',
    fontSize: '0.65rem',
    height: 22,
    px: 0.5,
    fontFamily: "'Tajawal', sans-serif",

};