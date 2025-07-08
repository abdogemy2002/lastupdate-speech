import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Box, Button, CircularProgress, Alert } from '@mui/material';
import { toast } from 'react-toastify';


const CheckoutForm = ({ doctorId, paymentIntentId, navigate }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.origin + '/payment-success'
            },
            redirect: 'if_required'
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('🎉 تمت العملية بنجاح! سيتم تحويلك للوحة التحكم...');

            setTimeout(() => {
                navigate('/dashboard'); // عدل المسار لو عندك مسار مختلف
            }, 2000); // 2 ثانية

        } else {
            setError('فشل في تأكيد الدفع. الرجاء المحاولة مرة أخرى.');
            setLoading(false);
        }
    };
    return (
        <Box component="form" onSubmit={handleSubmit}>
            <PaymentElement />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

            <Button
                variant="contained"
                type="submit"
                disabled={!stripe || loading}
                sx={{ mt: 3, width: '100%' }}
            >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'ادفع الآن'}
            </Button>
        </Box>
    );
};

export default CheckoutForm;
