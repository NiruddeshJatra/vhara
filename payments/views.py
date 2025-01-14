from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Payment
from .serializers import PaymentSerializer
import uuid

class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            transaction_id=str(uuid.uuid4())  # Generate a unique transaction ID
        )

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        payment = self.get_object()

        try:
            # Simulate payment gateway processing
            if self._process_payment_with_gateway(payment):
                payment.status = 'COMPLETED'
                payment.save()
                return Response({'status': 'Payment processed successfully.'})
            else:
                payment.status = 'FAILED'
                payment.save()
                return Response(
                    {'error': 'Payment processing failed.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            payment.status = 'FAILED'
            payment.save()
            return Response(
                {'error': f"Payment failed due to: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _process_payment_with_gateway(self, payment):
        """
        Placeholder for payment gateway integration logic.
        Simulate success for amounts <= 10000.
        """# Simulate payment processing
        # In reality, you would:
        # 1. Initialize payment with gateway
        # 2. Redirect user to payment page or handle mobile banking
        # 3. Process webhook/callback from payment provider
        # 4. Update payment status based on gateway response
        
        # For demo purposes, simulate success based on amount
        
        return payment.amount <= Decimal('10000')
