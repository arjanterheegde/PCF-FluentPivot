import * as React from 'react';
import { useState, useEffect } from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

export interface IReactControlProps {
  items: { name: string; alias: string }[];
  onTabClick: (alias: string) => void;
  selectedAlias: string | null;
  rememberSelected: boolean;
}

export const ReactPivotControl: React.FunctionComponent<IReactControlProps> = (props) => {
  const { items, onTabClick, selectedAlias, rememberSelected } = props;

  const [activeAlias, setActiveAlias] = useState<string | null>(selectedAlias);

  useEffect(() => {
    if (!rememberSelected && selectedAlias !== activeAlias) {
      setActiveAlias(selectedAlias);
    }
  }, [selectedAlias, rememberSelected, activeAlias]);

  // Function to handle tab click
  const handleLinkClick = (item?: PivotItem) => {
    if (item) {
      const alias = item.props.itemKey;
      if (alias) {
        setActiveAlias(alias);
        onTabClick(alias); 
      }
    }
  };

  return (
    <Pivot
      onLinkClick={handleLinkClick}
      selectedKey={activeAlias || undefined}
    >
      {items.map((item, index) => (
        <PivotItem
          headerText={item.name}
          key={index}
          itemKey={item.alias}
        >
        </PivotItem>
      ))}
    </Pivot>
  );
};
