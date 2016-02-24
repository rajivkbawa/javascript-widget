"use strict";

class widget {
    
    constructor(canvasId, sPoint) {
        this.canvasId = canvasId;
        this.iTargetSpeed = 20;
        this.sPoint = sPoint;
        this.ePoint = 10;
    }

    draw(iCurrentSpeed) {

        var canvas = document.getElementById(this.canvasId),
        options = null;

        if (canvas !== null && canvas.getContext) {
            
            options = this.buildOptions(canvas, iCurrentSpeed);
            this.clearCanvas(options);
            this.drawMetallicArc(options);
            this.drawBackground(options);
            this.drawTicks(options);
            this.drawTextMarkers(options);
            this.drawSpeedometerColourArc(options);
            this.drawNeedle(options);

        } else {
            alert("Canvas not supported by your browser!");
        }
    }

    buildOptions(canvas, iSpeed) {

        var centerX = 210,
        centerY = 210,
        radius = 140,
        outerRadius = 200;

        return {
            ctx: canvas.getContext('2d'),
            speed: iSpeed,
            center:	{
                X: centerX,
                Y: centerY
            },
            levelRadius: radius - 10,
            gaugeOptions: {
                center:	{
                    X: centerX,
                    Y: centerY
                },
                radius: radius
            },
            radius: outerRadius
        };
    }
    
    clearCanvas(options) {
        options.ctx.clearRect(0, 0, 800, 600);
        this.ContextSettings(options);
    }
    
    ContextSettings(options) {
        options.ctx.lineWidth = 2;
        options.ctx.globalAlpha = 0.5;
        options.ctx.strokeStyle = "rgb(255, 255, 255)";
        options.ctx.fillStyle = "rgb(255,255,255)";
    }
    
    drawMetallicArc(options) {
        this.drawOuterArc(options);
        this.drawInnerArc(options);
    }
    
    drawOuterArc(options) {
        options.ctx.beginPath();
        options.ctx.fillStyle = "rgb(127,127,127)";
        options.ctx.arc(options.center.X, options.center.Y, options.radius, 0, Math.PI, true);
        options.ctx.fill();
    }

    drawInnerArc(options) {
        options.ctx.beginPath();
        options.ctx.fillStyle = "rgb(255,255,255)";
        options.ctx.arc(options.center.X, options.center.Y, (options.radius / 100) * 90, 0, Math.PI, true);
        options.ctx.fill();
    }
    drawBackground(options) {
        var i = 0;
        options.ctx.globalAlpha = 0.2;
        options.ctx.fillStyle = "rgb(9, 87, 132)";
        for (i = 170; i < 180; i++) {
            options.ctx.beginPath();
            options.ctx.arc(options.center.X, options.center.Y, i, 0, Math.PI, true);
            options.ctx.fill();
        }
    }
    drawTicks(options) {
        this.SmallTickMarks(options);
        this.LargeTickMarks(options);
    }
    
    createLine(fromX, fromY, toX, toY, fillStyle, lineWidth, alpha) {
        return {
            from: {
                X: fromX,
                Y: fromY
            },
            to:	{
                X: toX,
                Y: toY
            },
            fillStyle: fillStyle,
            lineWidth: lineWidth,
            alpha: alpha
        };
    }
    
    SmallTickMarks(options) {

        var tickvalue = options.levelRadius - 8,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        onArchX,
        onArchY,
        innerTickX,
        innerTickY,
        fromX,
        fromY,
        line,
        toX,
        toY;

        this.ContextSettings(options);

        for (iTick = 10; iTick < 180; iTick += 20) {

            iTickRad = this.degToRad(iTick);
            onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
            onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
            innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
            innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

            fromX = (options.center.X - gaugeOptions.radius) + onArchX;
            fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
            toX = (options.center.X - gaugeOptions.radius) + innerTickX;
            toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

            line = this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);
            this.drawLine(options, line);

        }
    }

    LargeTickMarks(options) {

        var tickvalue = options.levelRadius - 8,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickRad = 0,
        innerTickY,
        innerTickX,
        onArchX,
        onArchY,
        fromX,
        fromY,
        toX,
        toY,
        line;

        this.ContextSettings(options);

        tickvalue = options.levelRadius - 2;

        for (iTick = 20; iTick < 180; iTick += 20) {
            
            iTickRad = this.degToRad(iTick);
            onArchX = gaugeOptions.radius - (Math.cos(iTickRad) * tickvalue);
            onArchY = gaugeOptions.radius - (Math.sin(iTickRad) * tickvalue);
            innerTickX = gaugeOptions.radius - (Math.cos(iTickRad) * gaugeOptions.radius);
            innerTickY = gaugeOptions.radius - (Math.sin(iTickRad) * gaugeOptions.radius);

            fromX = (options.center.X - gaugeOptions.radius) + onArchX;
            fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + onArchY;
            toX = (options.center.X - gaugeOptions.radius) + innerTickX;
            toY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY;

            line = this.createLine(fromX, fromY, toX, toY, "rgb(127,127,127)", 3, 0.6);

            this.drawLine(options, line);
            
        }
    }
    
    degToRad(angle) {
        return ((angle * Math.PI) / 180);
    }

    radToDeg(angle) {
        return ((angle * 180) / Math.PI);
    }
    
    drawLine(options, line) {
        options.ctx.beginPath();

        options.ctx.globalAlpha = line.alpha;
        options.ctx.lineWidth = line.lineWidth;
        options.ctx.fillStyle = line.fillStyle;
        options.ctx.strokeStyle = line.fillStyle;
        options.ctx.moveTo(line.from.X, line.from.Y);

        options.ctx.lineTo(
            line.to.X,
            line.to.Y
        );

        options.ctx.stroke();
    }
    
    drawTextMarkers(options) {

        var innerTickX = 0,
        innerTickY = 0,
        iTick = 0,
        gaugeOptions = options.gaugeOptions,
        iTickToPrint = this.sPoint;

        this.ContextSettings(options);

        options.ctx.font = 'italic 10px sans-serif';
        options.ctx.textBaseline = 'top';
        options.ctx.beginPath();

        for (iTick = 10; iTick < 180; iTick += 20) {

            innerTickX = gaugeOptions.radius - (Math.cos(this.degToRad(iTick)) * gaugeOptions.radius);
            innerTickY = gaugeOptions.radius - (Math.sin(this.degToRad(iTick)) * gaugeOptions.radius);

            if (iTick <= 10) {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
            } else if (iTick < 50) {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX - 5,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
            } else if (iTick < 90) {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
            } else if (iTick === 90) {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 4,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
            } else if (iTick < 145) {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 10,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY);
            } else {
                options.ctx.fillText(iTickToPrint, (options.center.X - gaugeOptions.radius - 12) + innerTickX + 15,
                (gaugeOptions.center.Y - gaugeOptions.radius - 12) + innerTickY + 5);
            }

            iTickToPrint += Math.round(100 / this.ePoint);
        }

        options.ctx.stroke();
    }
    
    drawSpeedometerColourArc(options) {

        var startOfGreen = 10,
        endOfGreen = 200,
        endOfOrange = 280;

        this.drawSpeedometerPart(options, 1.0, "rgb(82, 240, 55)", startOfGreen);
        this.drawSpeedometerPart(options, 0.9, "rgb(198, 111, 0)", endOfGreen);
        this.drawSpeedometerPart(options, 0.9, "rgb(255, 0, 0)", endOfOrange);

    }
    
    drawSpeedometerPart(options, alphaValue, strokeStyle, startPos) {

        options.ctx.beginPath();
        options.ctx.globalAlpha = alphaValue;
        options.ctx.lineWidth = 5;
        options.ctx.strokeStyle = strokeStyle;
        options.ctx.arc(options.center.X,
        options.center.Y,
        options.levelRadius,
        Math.PI + (Math.PI / 360 * startPos), 0 - (Math.PI / 360 * 10), false);

        options.ctx.stroke();
    }

    convertSpeedToAngle(options) {
        
        var iSpeed = (options.speed / 10),
        iSpeedAsAngle = ((iSpeed * 20) + 10) % 180;

        if (iSpeedAsAngle > 180) {
            iSpeedAsAngle = iSpeedAsAngle - 180;
        } else if (iSpeedAsAngle < 0) {
            iSpeedAsAngle = iSpeedAsAngle + 180;
        }

        return iSpeedAsAngle;
    }
    
    drawNeedle(options) {

        var iSpeedAsAngle = this.convertSpeedToAngle(options),
            iSpeedAsAngleRad = this.degToRad(iSpeedAsAngle),
            gaugeOptions = options.gaugeOptions,
            innerTickX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * 20),
            innerTickY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * 20),
            fromX = (options.center.X - gaugeOptions.radius) + innerTickX,
            fromY = (gaugeOptions.center.Y - gaugeOptions.radius) + innerTickY,
            endNeedleX = gaugeOptions.radius - (Math.cos(iSpeedAsAngleRad) * gaugeOptions.radius),
            endNeedleY = gaugeOptions.radius - (Math.sin(iSpeedAsAngleRad) * gaugeOptions.radius),
            toX = (options.center.X - gaugeOptions.radius) + endNeedleX,
            toY = (gaugeOptions.center.Y - gaugeOptions.radius) + endNeedleY,
            line = this.createLine(fromX, fromY, toX, toY, "rgb(255,0,0)", 5, 0.6);

        this.drawLine(options, line);

        this.drawNeedleDial(options, 0.6, "rgb(127, 127, 127)", "rgb(255,255,255)");
        this.drawNeedleDial(options, 0.2, "rgb(127, 127, 127)", "rgb(127,127,127)");

    }
    
    drawLine(options, line) {

        options.ctx.beginPath();

        options.ctx.globalAlpha = line.alpha;
        options.ctx.lineWidth = line.lineWidth;
        options.ctx.fillStyle = line.fillStyle;
        options.ctx.strokeStyle = line.fillStyle;
        options.ctx.moveTo(line.from.X, line.from.Y);

        options.ctx.lineTo(
            line.to.X,
            line.to.Y
        );

        options.ctx.stroke();
    }
    
    drawNeedleDial(options, alphaValue, strokeStyle, fillStyle) {

        var i = 0;

        options.ctx.globalAlpha = alphaValue;
        options.ctx.lineWidth = 3;
        options.ctx.strokeStyle = strokeStyle;
        options.ctx.fillStyle = fillStyle;

        for (i = 0; i < 30; i++) {

            options.ctx.beginPath();
            options.ctx.arc(options.center.X,
                options.center.Y,
                i,
                0,
                Math.PI,
                true);

            options.ctx.fill();
            options.ctx.stroke();
        }
    }

}