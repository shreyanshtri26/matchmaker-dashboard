interface SendMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  match: Match;
  onSend: (match: Match) => void;
}
