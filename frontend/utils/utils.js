export function getInitials(name) {
    if (!name) {
        return "?";
    }

    return name
        .trim()
        .split(/\s+/)
        .map((word) => word[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
}