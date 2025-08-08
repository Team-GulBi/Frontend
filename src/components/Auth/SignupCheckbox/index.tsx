interface AllCheckboxProps {
  allChecked: boolean;
  toggleAll: (checked: boolean) => void;
}

export const AllCheckbox = ({allChecked, toggleAll}: AllCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={allChecked}
        onChange={(e) => toggleAll(e.target.checked)}
        className="h-4 w-4"
      />
      <label className="text-medium20 font-semibold text-neutral-10">
        전체 동의
      </label>
    </div>
  );
};

interface CheckboxProps {
  labelText: string;
  checked: boolean;
  onChange: () => void;
}

export const Checkbox = ({labelText, checked, onChange}: CheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3 w-3"
      />
      <label className="text-small16 text-neutral-0">
        {labelText}
      </label>
    </div>
  );
};