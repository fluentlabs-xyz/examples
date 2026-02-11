"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressContainer = exports.ProfileContainer = exports.ContentContainer = exports.DialogContainer = void 0;
exports.DialogContainer = {
    "& .MuiDialog-paper": {
        width: "360px",
        borderRadius: "12px",
        borderColor: "#000",
        margin: 0,
        padding: "20px",
        minHeight: "300px",
        justifyContent: "end",
    },
};
exports.ContentContainer = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
};
exports.ProfileContainer = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    rowGap: "12px",
    marginBottom: "24px",
};
exports.AddressContainer = {
    display: "flex",
    alignItems: "center",
    columnGap: "4px",
};
