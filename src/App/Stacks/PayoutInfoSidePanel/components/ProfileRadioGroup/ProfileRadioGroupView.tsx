import { ReactElement } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { FormOption, Size as FormOptionSize, Variant } from "src/components/FormOption/FormOption";

type Option = {
  value: string;
  label: string;
  icon?: ReactElement;
};

type PropsType = {
  label?: string;
  options: Option[];
  register?: UseFormRegisterReturn;
  showRequiredError: boolean;
};

export default function View({ label, options, register, showRequiredError }: PropsType) {
  return (
    <label className="flex flex-col gap-2">
      {label ? (
        <div className="text-sm font-medium tracking-tight text-greyscale-300">
          {label}
          {showRequiredError && <span className="pl-0.5 text-orange-500">{"*"}</span>}
        </div>
      ) : null}
      <div className="flex flex-row items-center gap-2">
        {options.map(option => (
          <div className="flex" key={option.value}>
            <input type="radio" id={option.value} {...register} className="peer hidden" value={option.value} />
            <FormOption
              as="label"
              className="h-9 w-fit"
              data-testid={option.value}
              htmlFor={option.value}
              size={FormOptionSize.Md}
              variant={Variant.Transparent}
            >
              {option.icon}
              {option.label}
            </FormOption>
          </div>
        ))}
      </div>
    </label>
  );
}
