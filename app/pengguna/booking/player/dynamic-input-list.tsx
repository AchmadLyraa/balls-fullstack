import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  PropsWithChildren,
} from "react";
import { Input } from "@/components/ui/input";

type DynamicInputListProps = PropsWithChildren<{
  placeholder: string;
  initialValue: string;
  initialValueDisabled?: boolean;
  maxValues?: number;
}>;

export interface DynamicInputListRef {
  getValues(): string[];
}

const DynamicInputList = forwardRef<DynamicInputListRef, DynamicInputListProps>(
  (
    {
      placeholder,
      initialValue,
      initialValueDisabled,
      maxValues = Infinity,
      children,
    },
    ref,
  ) => {
    const [inputs, setInputs] = useState(
      initialValueDisabled
        ? [""]
        : maxValues === 1
          ? [initialValue]
          : [initialValue, ""],
    );
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useImperativeHandle(ref, () => ({
      getValues() {
        return inputs.filter((v) => v.trim() !== "");
      },
    }));

    const handleChange = (value: string, index: number) => {
      const newInputs = [...inputs];
      newInputs[index] = value;
      setInputs(newInputs);

      if (
        index === inputs.length - 1 &&
        value.trim() !== "" &&
        newInputs.length < maxValues
      ) {
        setInputs([...newInputs, ""]);
      }
    };

    const handleBlur = (index: number) => {
      if (index === inputs.length - 1) return;

      const current = inputRefs.current[index];
      if (inputs[index].trim() === "" && document.activeElement !== current) {
        const updated = inputs.filter((_, i) => i !== index);
        setInputs(updated);
        inputRefs.current.splice(index, 1);
      }
    };

    return (
      <div className="flex flex-col gap-2">
        {children}

        {initialValueDisabled && <Input value={initialValue} disabled />}

        {inputs.map((value, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            value={value}
            onChange={(e) => handleChange(e.target.value, index)}
            onBlur={() => handleBlur(index)}
            placeholder={`${placeholder} ${index + 1}`}
          />
        ))}
      </div>
    );
  },
);

export default DynamicInputList;
