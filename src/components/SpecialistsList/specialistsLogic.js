// src/pages/specialistsLogic.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useSpecialistsLogic() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 5;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    'https://speech-correction-api.azurewebsites.net/api/Doctor/get-all-doctors',
                    { params: { pageIndex, pageSize } }
                );

                setDoctors(response.data.data || []);
                setTotalPages(Math.ceil((response.data.count || 0) / pageSize));
                console.log('Fetched doctors:', response.data.data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching doctors:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [pageIndex]);

    const handleDoctorClick = (doctor) => {
        navigate(`/doctors/${doctor.id}`, { state: { doctor } });
    };

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    return {
        doctors,
        loading,
        error,
        pageIndex,
        totalPages,
        handleDoctorClick,
        handlePageChange,
        navigate
    };
}
