import { FormationEditorForm } from "../FormationEditorForm";
import { getDefaultFormationValues } from "../formation-defaults";

export default function NouvelleFormationPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      <FormationEditorForm
        mode="create"
        defaultValues={getDefaultFormationValues()}
      />
    </div>
  );
}
