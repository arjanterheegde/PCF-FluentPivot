import {IInputs, IOutputs} from "./generated/ManifestTypes";
import {IReactControlProps, ReactPivotControl} from "./PivotControl";
import * as React from "react";
import * as ReactDOM from "react-dom";

export class FluentPivot implements ComponentFramework.ReactControl<IInputs, IOutputs> {

    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _selectedAlias: string | null = null;

    /**
     * Called when the control is initialized
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): React.ReactElement {
        this._container = container;
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;

        return this.renderControl(context);
    }

    /**
     * Update view when data changes
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement   {
        console.log("Update view PCF")
        const itemsJson = context.parameters.tabs.raw || '[]';
        const items = JSON.parse(itemsJson);

        const rememberSelected = context.parameters.rememberSelected.raw;
    console.log(rememberSelected);
        if (!rememberSelected) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const defaultTab = items.find((item: any) => item.isDefault) || null;
    
            if (defaultTab) {
                this._selectedAlias = defaultTab.alias;
            } else {
                this._selectedAlias = null; // Reset alias if no default tab
            }
        }
    
        return this.renderControl(context);
    }

    private renderControl(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const itemsJson = context.parameters.tabs.raw || '[]';
        const items = JSON.parse(itemsJson);
        const rememberSelected = context.parameters.rememberSelected.raw;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const defaultTab = items.find((item: any) => item.isDefault) || null;
        
        if (defaultTab) {
            this._selectedAlias = defaultTab.alias;
        }

        const props: IReactControlProps = {
            items: items,
            onTabClick: this.onTabClick.bind(this),
            selectedAlias: this._selectedAlias, 
            rememberSelected: rememberSelected 

        };

        return React.createElement(ReactPivotControl, props);
    }

    private onTabClick(alias: string): void {
        this._selectedAlias = alias;
        this._notifyOutputChanged();
    }

    /**
     * Called when the PCF control needs to output data
     */
    public getOutputs(): IOutputs {
        return {
            selectedTab: this._selectedAlias ?? undefined
        };
    }
    

    /**
     * Clean up when the control is removed
     */
    public destroy(): void {
    }
}
