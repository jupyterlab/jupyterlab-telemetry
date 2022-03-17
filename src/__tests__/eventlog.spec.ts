//import { CommandRegistry } from '@lumino/commands';
import { CommandRegistry } from '@lumino/commands';
import {EventLog} from '../index'

jest.spyOn(console, "log").mockImplementation(() => {});

describe("EventLog", () => {
    let el: any = null;
    let handler: any = null;
    const schema = 'org.jupyterlab';

    describe("EventLog without CommandRegistry", () => {
        
        beforeEach(() => {
            handler = jest.fn();
            el = new EventLog({
                allowedSchemas: [schema],
                handlers: [handler]    
            });
        });

        afterEach(() => {
            el.dispose();
            el = null;
        });
        
        const event = {
            schema,
            version: 1,
            body: {
                'foo': 'bar'
            }
        };

        describe("#recordEvent", () => {
            it("should call handler with event data", async () => {
                await el.recordEvent(event);
                expect(handler.mock.calls.length).toBe(1);
                const args = handler.mock.calls[0].pop()[0];
                expect(args.body).toEqual({
                    "foo": "bar"
                });
                expect(args.schema).toEqual(schema);
                expect(args.version).toEqual(1);
                expect(args.publishTime).not.toBeNull;
            });

            it("should not call handler if schema is not whitelisted", async () => {
                await el.recordEvent({
                    ...event,
                    schema: "org.foo"
                });
                expect(handler.mock.calls.length).toBe(0);
            });
        });

    });

    describe("EventLog with CommandRegistry", () => {
        
        let registry: any = null;
        const commandId = "command";

        beforeEach(() => {
            jest.useFakeTimers();
            handler = jest.fn();
            registry = new CommandRegistry();
            registry.addCommand(commandId, {
                execute: () => {}
            });

            el = new EventLog({
                allowedSchemas: [`org.jupyterlab.commands.${commandId}`],
                handlers: [handler],
                commandRegistry: registry    
            });
        });

        afterEach(() => {
            el.dispose();
            el = null;
            registry = null;
            jest.useRealTimers();
        });
        
        it("should emit jupyterlab commands with a default timeout", async () => {
            await registry.execute(commandId);
            expect(handler.mock.calls.length).toBe(0);
            jest.advanceTimersByTime(120 * 1000);
            expect(handler.mock.calls.length).toBe(1);
        });

        describe("#dispose", () => {
            it("should not emit any jupyterlab commands after dispose is called", async () => {
                el.dispose();
                await registry.execute(commandId);
                jest.advanceTimersByTime(120 * 1000);
                expect(handler.mock.calls.length).toBe(0);
            });
        });
        
    });
});