export function resolveProperty<T>(object: T, path: string)
{
    const segments = path.split('.');

    let subobject: any = object;
    for (let i = 0; i < segments.length; i++)
    {
        subobject = subobject[segments[i]];
    }

    return subobject;
};
