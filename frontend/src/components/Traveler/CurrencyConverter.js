import React, { useState } from 'react';
import styled from 'styled-components';
import { DollarSign, ArrowRightLeft } from 'lucide-react';

const ConverterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SwapButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const ResultBox = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const ResultAmount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const ResultCurrency = styled.div`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const Currencies = {
  USD: { name: 'US Dollar', rate: 1.0 },
  EUR: { name: 'Euro', rate: 0.92 },
  GBP: { name: 'British Pound', rate: 0.79 },
  JPY: { name: 'Japanese Yen', rate: 150.0 },
  INR: { name: 'Indian Rupee', rate: 83.0 },
  AUD: { name: 'Australian Dollar', rate: 1.5 },
  CAD: { name: 'Canadian Dollar', rate: 1.35 },
  CHF: { name: 'Swiss Franc', rate: 0.88 },
  CNY: { name: 'Chinese Yuan', rate: 7.2 },
  THB: { name: 'Thai Baht', rate: 35.0 },
  SGD: { name: 'Singapore Dollar', rate: 1.35 },
  AED: { name: 'UAE Dirham', rate: 3.67 },
  TRY: { name: 'Turkish Lira', rate: 32.0 },
  EGY: { name: 'Egyptian Pound', rate: 48.0 },
  ZAR: { name: 'South African Rand', rate: 18.5 }
};

function CurrencyConverter() {
  const [amount, setAmount] = useState(100);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const convertCurrency = () => {
    const fromRate = Currencies[fromCurrency]?.rate || 1;
    const toRate = Currencies[toCurrency]?.rate || 1;
    return (amount * (toRate / fromRate)).toFixed(2);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <ConverterContainer>
      <InputGroup>
        <Label>Amount</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </InputGroup>

      <InputGroup>
        <Label>From Currency</Label>
        <Select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
          {Object.entries(Currencies).map(([code, info]) => (
            <option key={code} value={code}>
              {code} - {info.name}
            </option>
          ))}
        </Select>
      </InputGroup>

      <SwapButton onClick={swapCurrencies}>
        <ArrowRightLeft size={20} />
        Swap Currencies
      </SwapButton>

      <InputGroup>
        <Label>To Currency</Label>
        <Select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
          {Object.entries(Currencies).map(([code, info]) => (
            <option key={code} value={code}>
              {code} - {info.name}
            </option>
          ))}
        </Select>
      </InputGroup>

      <ResultBox>
        <ResultAmount>
          <DollarSign size={32} style={{ display: 'inline', verticalAlign: 'middle' }} />
          {convertCurrency()}
        </ResultAmount>
        <ResultCurrency>{Currencies[toCurrency]?.name}</ResultCurrency>
      </ResultBox>
    </ConverterContainer>
  );
}

export default CurrencyConverter;

