import { observable } from "@legendapp/state";

export interface IDrawerState {
	isOpen: boolean;
	close: () => void;
	open: () => void;
}
const drawerState$ = observable<IDrawerState>({
	isOpen: false,
	close: () => drawerState$.isOpen.set(false),
	open: () => drawerState$.isOpen.set(true),
});

export interface IUiState {
	drawer: IDrawerState;
}

export const uiState$ = observable<IUiState>({
	drawer: drawerState$,
});
