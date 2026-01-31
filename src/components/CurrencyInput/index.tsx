import React from "react";
import { TextInput } from "flowbite-react";

interface CurrencyInputProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  placeholder,
  value,
  onChange,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.replace(/\D/g, "");

    if (inputValue === "") {
      e.target.value = "";
      onChange(e);
      return;
    }
    const rawValue = (parseInt(inputValue, 10) / 100).toFixed(2);

    const numericValue = parseInt(inputValue, 10) / 100;
    const formattedValue = numericValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    e.target.value = rawValue;
    onChange(e);

    // Update input display
    e.currentTarget.value = formattedValue;
  };

  return (
    <TextInput
      id={id}
      placeholder={placeholder || "R$ 0,00"}
      value={
        value === ""
          ? ""
          : parseFloat(value).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
              style: "currency",
              currency: "BRL",
            })
      }
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
