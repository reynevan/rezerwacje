@extends('emails.base')
@section('content')
<div>
    Elo {{ $user->first_name }}, tu masz link:
    {{ config('app.url') }}/haslo/{{ $token }}

    token: {{ $token }}
</div>
@endsection