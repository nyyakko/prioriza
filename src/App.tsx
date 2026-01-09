import { Tabs, Tab } from './Components/Tabs';

import MinhasAcoes from './MinhasAcoes';
import NovoAporte from './NovoAporte';

export default function App()
{
    return (
        <div className='flex flex-col items-center py-4 gap-4'>
            <section className='w-[60%] 2xl:w-[50%] bg-background dark:bg-background-dark rounded-lg p-4 flex flex-col gap-4'>
                <Tabs>
                    <Tab header='Minhas Ações'>
                        <MinhasAcoes />
                    </Tab>
                    <Tab header='Novo Aporte'>
                        <NovoAporte />
                    </Tab>
                </Tabs>
            </section>
        </div>
    );
}
