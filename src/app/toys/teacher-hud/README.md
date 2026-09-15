# Teacher HUD

A dashboard to help my gf manage and display agendas for her class


## features

 - daily display
	 - agenda
	 - warmup
	 - due assignments
	 - msc others
	 - (editor to change layout and arrangement)
 - weekly display
  - agenda
	- due assignments

 - schedule editor


 - section manager
   - set section pattern on weekly/biweekly+ basis
	 - make temporary/forward changes to section pattern
	 - offset individual sections for delays
	 - new agenda items apply to all sections (with offset)
	 - edits to individual sections 


## structure

has a parent component that switches between different displays

each child component can used independently to embed specific views in other pages

each component takes a class key to a local storage object that contains the data to display


