from typing import *

DOC_PARAM = {
    "title": "Title",
    "areas": "AREAS",
    "colors": "colors",
    "local": "local",
}

BASE_AREAS = []
BASE_COLS = ["#ff0000", "#00ff00", "#0000ff", "#8f1a9c", "#f7e707"]
IS_LOCAL = True
START = None

TILE_PARAM = {
    "start": "START",
    "area": "area",
    "area-name": "area-name",
    "down": "down",
    "up": "up",
    "left": "left",
    "right": "right",
}

MODULES = {
    "text": "Text",
    "input": "Input",
}

TEXT_MODLETS = {
    "Title": "Title",
    "Para": "Para",
    "Dia": "Dia",
}

INPUT_MODLETS = {
    "Word": "Word",
    "Char": "Char",
    "Col": "Col",
    "Submit": "Submit",
}

INPUT_PARAM = {
    "unlock": "unlock",
}

ERRORS = {
    "ctag": "ERROR __ Unexpected closing tag. Make sure closing tag is after opening tag and is spelled correctly.",
    "otag": "ERROR __ Unexpected opening tag. Make sure opening tag is spelled correctly and not in the wrong place.",
    "code": "ERROR __ Improper code. Make sure the code is 4 characters long and is only made up of alphanumeric characters.",

}

state = {
    "in_tile": False,
    "in_module": False,
    "tile_name": "",
    "module_name": "",
    "cont": False,
    "stop": False,
    "line_num": 0,
    "module_cumulator": "",
    "tile_cumulator": "",
    "output": "",
}


def interpret(fileName: str) -> None:
    f = open(fileName + ".txt", 'r')
    out = open(fileName + ".json", 'w')
    parse(f, out)


def parse(self, cont: list[str], json: TextIO) -> None:
    for line in cont:
        line = line.strip()
        state.line_num += 1
        if line[0] == "<":
            parseTag(line, state)
        else:
            continue
        if not state.stop:
            break


def parseTag(line: str) -> None:
    text = line.strip(">").strip("<")
    if text[0] == "/":
        if state.in_module and state.module_name == text[1:]:
            state.in_module = False
            state.module_name = ""
            state.module_cumulator += "]}"
        elif state.in_tile and state.tile_name == text[1:]:
            state.in_tile = False
            state.tile_name = ""
            state.tile_cumulator += "}"
        else:
            error("ctag")
    else:
        if not state.in_module and not state.in_tile:
            if properCode(text):
                state.in_tile = True
                state.tile_name = text
                state.tile_cumulator += f"\"{state.tile_name}\":{{"
        elif state.in_module and not state.in_tile:
            if text in MODULES:
                state.in_module = True
                state.module_name = MODULES[text]
                state.module_cumulator += f"{{\"name\":\"{state.module_name}\",\"modlets\":["
        else:
            error("otag")


def properCode(code: str) -> bool:
    if len(code) != 4 and code.isalnum():
        return True
    error("code")
    return False


def error(case: str) -> None:
    if case in ERRORS:
        print(ERRORS[case] + "\nOn line " + str(state.line_num))
    else:
        print(ERRORS["unknown"] + "\nOn line " + str(state.line_num))
    state.stop = True
