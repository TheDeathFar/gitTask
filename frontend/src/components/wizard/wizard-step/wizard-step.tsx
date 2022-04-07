import React, { createContext, FC, useContext } from 'react';
import {
  WizardContext,
  WizardContextActions,
  WizardContextActionsInterface,
  WizardContextInterface,
} from '#components/wizard/wizard';

export interface WizardStepContextInterface {
  index: number;
  softHide: boolean;
}

export const WizardStepContext = createContext<WizardStepContextInterface>(null);

export interface WizardStepProps {
  render: (wizardContext: WizardContextInterface & WizardContextActionsInterface) => React.ReactNode;
}

export interface WizardStepElement extends JSX.Element {}

export const WizardStep: FC<WizardStepProps> = (props) => {
  const { render } = props;

  const wizardContext = useContext(WizardContext);
  const wizardContextActions = useContext(WizardContextActions);
  const wizardStepContext = useContext(WizardStepContext);

  const hidden = wizardContext.step !== wizardStepContext.index;

  if (!wizardStepContext.softHide && hidden)
    return null;

  return (
    <div style={{ display: (hidden) ? `none` : `block` }}>
      {render({ ...wizardContext, ...wizardContextActions })}
    </div> as WizardStepElement
  );
};